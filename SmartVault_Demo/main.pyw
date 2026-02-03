import sys
import os
os.environ["QT_ENABLE_HIGHDPI_SCALING"] = "0"
os.environ["QT_AUTO_SCREEN_SCALE_FACTOR"] = "1"
os.environ["QT_SCALE_FACTOR"] = "1"

import shutil
import tempfile
import time
import re
import gc
import cv2
import requests
import json
from enum import Enum
import easyocr
import pyperclip
from deep_translator import GoogleTranslator, MyMemoryTranslator
from pynput import keyboard
from PyQt6.QtWidgets import (QApplication, QWidget, QLabel, QPushButton, 
                             QHBoxLayout, QVBoxLayout, QFileDialog, QMenu,
                             QToolTip, QTextEdit, QDialog, QMessageBox, QSystemTrayIcon,
                             QFrame)
from PyQt6.QtCore import Qt, QPoint, QRect, pyqtSignal, QSize, QThread, QPointF, QLockFile, QDir
from PyQt6.QtGui import (QPainter, QPen, QColor, QScreen, QPixmap, QIcon, 
                         QAction, QBrush, QCursor, QPainterPath, QPolygonF, QRegion)

# ============================================================================
# 全局工具函数：生成默认图标
# ============================================================================
def create_default_icon():
    pixmap = QPixmap(64, 64)
    pixmap.fill(QColor("#07C160"))
    painter = QPainter(pixmap)
    painter.setPen(QColor("white"))
    font = painter.font()
    font.setPixelSize(30)
    font.setBold(True)
    painter.setFont(font)
    painter.drawText(pixmap.rect(), Qt.AlignmentFlag.AlignCenter, "SC")
    painter.end()
    return QIcon(pixmap)

# ============================================================================
# V8.0 终极稳定版核心配置与工具枚举
# ============================================================================

class ToolType(Enum):
    NONE = 0
    RECTANGLE = 1
    ELLIPSE = 2
    ARROW = 3
    PEN = 4
    MOSAIC = 5
    TEXT = 6

class DrawObject:
    def __init__(self, dtype, start_pt, pen_color=Qt.GlobalColor.red, pen_width=2):
        self.dtype = dtype
        self.start_pt = start_pt
        self.end_pt = start_pt
        self.points = [start_pt]
        self.text = ""
        self.color = pen_color
        self.width = pen_width

# ============================================================================
# AI 工作线程 (OCR 精度大飞跃 + 双引擎翻译)
# ============================================================================

class AIWorker(QThread):
    finished = pyqtSignal(str)
    
    def __init__(self, image, mode='ocr'):
        super().__init__()
        self.image = image
        self.mode = mode
        
    def run(self):
        try:
            # 0. 图片压缩预处理 (High DPI Speed Fix)
            # 如果图片过宽，先进行 resize，极大提升 OCR 速度
            if self.image.width() > 1280:
                print(f"DEBUG: Resizing image from width {self.image.width()} to 1280 for speed.")
                self.image = self.image.scaledToWidth(1280, Qt.TransformationMode.SmoothTransformation)
                
            # 1. 强制落盘 (Force Disk Write) - Restore V7.4 Image Clarity Fix
            print("DEBUG: AIWorker started (Disk Mode).")
            temp_path = os.path.abspath("temp_ocr.png")
            # Maintain using pixmap.save("temp_ocr.png", "PNG") logic
            self.image.save(temp_path, "PNG")

            # 2. 调用 EasyOCR
            global ocr_reader
            if ocr_reader is None:
                # Fallback if preload failed or not ready
                print("DEBUG: Initializing EasyOCR reader (Lazy Load)...")
                ocr_reader = easyocr.Reader(['ch_sim', 'en'], gpu=False) 
            
            # 识别 (Read from disk)
            print(f"DEBUG: Reading image from {temp_path}")
            
            # -----------------------------------------------------------------
            # 3. 强制图片压缩 (CV2 High Performance Resize)
            # -----------------------------------------------------------------
            img_np = cv2.imread(temp_path)
            if img_np is None:
                raise Exception("CV2 failed to load image")
            
            # 获取图片原本的尺寸
            h, w = img_np.shape[:2]
            
            # 如果图片宽度大于 1000 像素，强制缩小一半或限制到 1000 宽
            if w > 1000:
                scale = 1000 / w
                new_w = 1000
                new_h = int(h * scale)
                # 使用 opencv 的 resize 进行降维打击
                img_np = cv2.resize(img_np, (new_w, new_h))
                print(f"图片过大，已压缩至: {new_w}x{new_h}")

            # 启用 paragraph=True 以合并段落
            results = ocr_reader.readtext(img_np, paragraph=True)
            print(f"DEBUG: OCR Raw Results: {results}")
            
            full_text = ""
            for result in results:
                # result 只有两个元素：[坐标, 文本] (paragraph=True 模式)
                if len(result) >= 2:
                    text_line = result[1]
                    # (可选) 简单清理开头可能的乱码符号，保留常用标点
                    text_line = re.sub(r'^[^\w\u4e00-\u9fff\(\[\{"\'“‘]+', '', text_line)
                    full_text += text_line + "\n\n"
            
            cleaned_text = self.clean_text(full_text)

            if not cleaned_text.strip():
                print("DEBUG: OCR result is empty.")
                self.finished.emit("未识别到有效文字 (No Valid Text Found)")
                return

            # 4. 翻译逻辑 (针对中国大陆深度优化：阿里云 Qwen 官方接口优先)
            if self.mode == 'translate':
                print(f"DEBUG: 正在尝试国内原生直连翻译...")
                translated = None
                engine_name = ""

                # --- [方案 A] 阿里云 DashScope Qwen (国内官方，极速稳定) ---
                # 申请地址：https://dashscope.console.aliyun.com/ (免费额度巨大)
                # 只要填入 Key，关掉 VPN 也能秒开翻译
                DASHSCOPE_API_KEY = "" # <--- 请在此处填入您的 sk-xxxx 密钥
                
                if DASHSCOPE_API_KEY:
                    try:
                        api_url = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"
                        headers = {
                            "Authorization": f"Bearer {DASHSCOPE_API_KEY}",
                            "Content-Type": "application/json"
                        }
                        data = {
                            "model": "qwen-plus", # 也可以用 qwen-flash 速度更快
                            "messages": [
                                {"role": "system", "content": "你是一个专业的翻译官，请将输入的文字翻译成中文，保持自然流畅，只输出翻译结果。"},
                                {"role": "user", "content": cleaned_text}
                            ]
                        }
                        response = requests.post(api_url, headers=headers, json=data, timeout=5)
                        if response.status_code == 200:
                            translated = response.json()['choices'][0]['message']['content'].strip()
                            engine_name = "Qwen (Aliyun)"
                    except Exception as e:
                        print(f"Aliyun Qwen failed: {e}")

                # --- [方案 B] MyMemory (无需 VPN，作为备选) ---
                if not translated:
                    try:
                        # 指定 en -> zh-CN 避免 auto 报错
                        translated = MyMemoryTranslator(source='en', target='zh-CN').translate(cleaned_text)
                        engine_name = "MyMemory"
                    except Exception as e:
                        print(f"MyMemory failed: {e}")

                # --- [方案 C] Google (仅在 VPN 开启时尝试) ---
                if not translated:
                    try:
                        translated = GoogleTranslator(source='auto', target='zh-CN').translate(cleaned_text)
                        engine_name = "Google"
                    except Exception as e:
                        print(f"Google failed: {e}")

                if translated:
                    output = f"【原文】\n{cleaned_text}\n\n【译文 ({engine_name})】\n{translated}"
                else:
                    msg = "国内引擎连接失败。" if DASHSCOPE_API_KEY else "尚未配置阿里云 API KEY。"
                    output = f"【原文】\n{cleaned_text}\n\n【翻译失败】\n{msg}\n请：1. 开启 VPN；2. 或在代码中配置阿里云 DashScope KEY（推荐）。"
                
                self.finished.emit(output)
            else:
                self.finished.emit(cleaned_text)
                
        except Exception as e:
            print(f"DEBUG: AI Task Error: {str(e)}")
            self.finished.emit(f"AI 任务出错: {str(e)}")
        finally:
            # 5. 内存清理 (Memory Cleanup)
            # 显式释放大对象并触发 GC，防止内存泄漏
            self.image = None
            if 'img_np' in locals(): del img_np
            if 'results' in locals(): del results
            gc.collect()
            print("DEBUG: Memory cleanup completed.")

    def clean_text(self, text):
        lines = text.split('\n')
        valid_lines = []
        for line in lines:
            line = line.strip()
            if not line: continue
            if len(line) < 2 and not re.search(r'[\w\u4e00-\u9fff]', line):
                continue
            # 过滤乱码
            if re.match(r'^[\|\(\)\[\]\{\}<>]+$', line):
                continue
            valid_lines.append(line)
        return "\n".join(valid_lines)

ocr_reader = None

# ============================================================================
# 结果展示窗口
# ============================================================================

class ResultDialog(QDialog):
    def __init__(self, title, content, parent=None):
        super().__init__(parent)
        self.setWindowTitle(title)
        self.resize(600, 400)
        self.setWindowFlags(self.windowFlags() | Qt.WindowType.WindowStaysOnTopHint)
        self.setWindowIcon(create_default_icon())
        
        layout = QVBoxLayout()
        
        self.text_edit = QTextEdit()
        self.text_edit.setText(content)
        # 调整字体至 9pt (精致小巧)，窗口紧凑
        self.text_edit.setStyleSheet("font-size: 9pt; font-family: 'Microsoft YaHei'; padding: 10px;")
        # 确保垂直滚动条按需显示
        self.text_edit.setVerticalScrollBarPolicy(Qt.ScrollBarPolicy.ScrollBarAsNeeded)
        layout.addWidget(self.text_edit)
        
        btn_layout = QHBoxLayout()
        
        self.copy_btn = QPushButton("一键复制 (Copy All)")
        self.copy_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        self.copy_btn.setStyleSheet("""
            QPushButton {
                background-color: #07C160;
                color: white;
                border-radius: 4px;
                padding: 8px 16px;
                font-weight: bold;
                font-family: "Microsoft YaHei";
            }
            QPushButton:hover {
                background-color: #06AD56;
            }
        """)
        self.copy_btn.clicked.connect(self.copy_content)
        
        close_btn = QPushButton("关闭")
        close_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        close_btn.setStyleSheet("padding: 8px 16px;")
        close_btn.clicked.connect(self.close)
        
        btn_layout.addStretch()
        btn_layout.addWidget(self.copy_btn)
        btn_layout.addWidget(close_btn)
        
        layout.addLayout(btn_layout)
        self.setLayout(layout)
        
    def copy_content(self):
        text = self.text_edit.toPlainText()
        pyperclip.copy(text)
        QToolTip.showText(QCursor.pos(), "已复制到剪贴板！", self)

# ============================================================================
# 截图工具栏
# ============================================================================

class CaptureToolbar(QWidget):
    tool_selected = pyqtSignal(ToolType)
    action_triggered = pyqtSignal(str) 

    def __init__(self, parent=None):
        super().__init__(parent)
        self.setWindowFlags(Qt.WindowType.FramelessWindowHint | Qt.WindowType.Tool)
        self.setAttribute(Qt.WidgetAttribute.WA_TranslucentBackground)
        
        main_layout = QHBoxLayout()
        main_layout.setContentsMargins(0, 0, 0, 0)
        main_layout.setSpacing(0)
        
        container = QFrame()
        container.setStyleSheet("""
            QFrame {
                background-color: #2e2e2e;
                border-radius: 6px;
                border: 1px solid #4a4a4a;
            }
        """)
        container_layout = QHBoxLayout(container)
        container_layout.setContentsMargins(12, 10, 12, 10)
        container_layout.setSpacing(15)
        
        btn_style = """
            QPushButton {
                background-color: transparent;
                border: none;
                border-radius: 10px;
                color: #e0e0e0;
                font-family: "Segoe UI Emoji", "Microsoft YaHei";
                font-size: 36px;
                padding: 5px;
                font-weight: bold;
            }
            QPushButton:hover {
                background-color: #4a4a4a;
                color: white;
            }
            QPushButton:checked {
                background-color: #07C160;
                color: white;
            }
        """
        
        draw_tools = [
            ("rect", "矩形", ToolType.RECTANGLE, "⬜"),
            ("ellipse", "椭圆", ToolType.ELLIPSE, "⭕"),
            ("arrow", "箭头", ToolType.ARROW, "↗"),
            ("pen", "画笔", ToolType.PEN, "✎"),
            ("mosaic", "马赛克", ToolType.MOSAIC, "▒"),
            ("text", "文字", ToolType.TEXT, "T"),
            ("sticker", "贴图", None, "☺"), 
        ]
        
        ai_tools = [
            ("ocr", "文字提取", None, "文"),
            ("trans", "一键翻译", None, "译"),
            ("long", "滚动截图", None, "📜"),
        ]
        
        action_tools = [
            ("undo", "撤销", None, "↶"),
            ("share", "分享", None, "📤"),
            ("save", "保存", None, "💾"),
            ("close", "退出", None, "✖"),
            ("finish", "完成", None, "✔"),
        ]
        
        self.buttons = {}
        self.current_tool = ToolType.NONE
        
        def add_buttons(tools_list):
            for key, name, tool_type, icon_text in tools_list:
                btn = QPushButton(icon_text)
                btn.setFixedSize(60, 60)  # 强制加大按钮尺寸到 60x60
                # 显式设置字体以确保大小生效
                font = btn.font()
                font.setPointSize(24)     # 强制加大图标字体到 24pt
                btn.setFont(font)
                
                btn.setToolTip(name)
                btn.setCursor(Qt.CursorShape.PointingHandCursor)
                btn.setStyleSheet(btn_style)
                
                if tool_type:
                    btn.setCheckable(True)
                    btn.clicked.connect(lambda checked, k=key, t=tool_type: self.on_tool_click(k, t))
                else:
                    btn.clicked.connect(lambda checked, k=key: self.on_action_click(k))
                    if key == 'close':
                        btn.setStyleSheet(btn_style.replace("QPushButton:hover {", "QPushButton:hover { background-color: #ff4d4f;"))
                    if key == 'finish':
                        btn.setStyleSheet(btn_style.replace("QPushButton:hover {", "QPushButton:hover { background-color: #07C160;"))
                
                container_layout.addWidget(btn)
                self.buttons[key] = btn
        
        add_buttons(draw_tools)
        
        line1 = QFrame()
        line1.setFrameShape(QFrame.Shape.VLine)
        line1.setFrameShadow(QFrame.Shadow.Sunken)
        line1.setStyleSheet("background-color: #555;")
        container_layout.addWidget(line1)
        
        add_buttons(ai_tools)
        
        line2 = QFrame()
        line2.setFrameShape(QFrame.Shape.VLine)
        line2.setFrameShadow(QFrame.Shadow.Sunken)
        line2.setStyleSheet("background-color: #555;")
        container_layout.addWidget(line2)
        
        add_buttons(action_tools)
        
        main_layout.addWidget(container)
        self.setLayout(main_layout)

    def on_tool_click(self, key, tool_type):
        for k, btn in self.buttons.items():
            if k != key and btn.isCheckable():
                btn.setChecked(False)
        
        if self.buttons[key].isChecked():
            self.current_tool = tool_type
        else:
            self.current_tool = ToolType.NONE
            
        self.tool_selected.emit(self.current_tool)

    def on_action_click(self, key):
        self.action_triggered.emit(key)

# ============================================================================
# 截图遮罩层
# ============================================================================

class CaptureOverlay(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowFlags(Qt.WindowType.FramelessWindowHint | Qt.WindowType.WindowStaysOnTopHint | Qt.WindowType.Tool)
        self.setAttribute(Qt.WidgetAttribute.WA_TranslucentBackground)
        self.setMouseTracking(True)
        self.setWindowIcon(create_default_icon())
        
        screen = QApplication.primaryScreen()
        self.full_screen_pixmap = screen.grabWindow(0)
        self.setGeometry(screen.geometry())
        
        self.start_pos = None
        self.end_pos = None
        self.is_selecting = False
        self.has_selection = False
        self.selection_rect = QRect()
        
        self.draw_objects = []
        self.current_draw = None
        self.tool_type = ToolType.NONE
        
        self.text_input = QTextEdit(self)
        self.text_input.hide()
        self.text_input.setStyleSheet("background: transparent; border: 1px dashed white; color: red; font-size: 16px; font-weight: bold;")
        self.text_input.setVerticalScrollBarPolicy(Qt.ScrollBarPolicy.ScrollBarAlwaysOff)
        
        self.toolbar = CaptureToolbar(self)
        self.toolbar.hide()
        self.toolbar.tool_selected.connect(self.set_tool)
        self.toolbar.action_triggered.connect(self.handle_action)
        
        self.ai_worker = None

    def show(self):
        super().show()
        self.activateWindow()
        self.setFocus()

    def set_tool(self, tool_type):
        self.tool_type = tool_type
        if not self.has_selection:
            self.tool_type = ToolType.NONE

    def handle_action(self, action):
        if action == 'close':
            self.close_session() # V8.0 Fix: Only close session, not app
        elif action == 'finish':
            self.finish_capture()
        elif action == 'save':
            self.save_image()
        elif action == 'undo':
            if self.draw_objects:
                self.draw_objects.pop()
                self.update()
        elif action == 'ocr':
            self.run_ai('ocr')
        elif action == 'trans':
            self.run_ai('translate')
        elif action == 'share':
            self.share_image()
        elif action == 'long':
            self.finish_capture() 
            QToolTip.showText(QCursor.pos(), "已截取全屏并保存 (模拟滚动截图)", None, QRect(), 2000)
        elif action == 'sticker':
            self.show_sticker_menu()

    def show_sticker_menu(self):
        menu = QMenu(self)
        stickers = ["😊", "😂", "👍", "❤️", "🔥", "🎉", "🐛", "🐍", "👀", "🚫"]
        for s in stickers:
            action = QAction(s, self)
            action.triggered.connect(lambda checked, t=s: self.add_sticker(t))
            menu.addAction(action)
        menu.exec(QCursor.pos())

    def add_sticker(self, text):
        if not self.has_selection: return
        center = self.selection_rect.center()
        obj = DrawObject(ToolType.TEXT, center)
        obj.text = text
        obj.end_pt = center + QPoint(50, 50) 
        self.draw_objects.append(obj)
        self.update()

    def run_ai(self, mode):
        if not self.has_selection:
            return
        
        # 设置鼠标忙碌状态
        self.setCursor(Qt.CursorShape.WaitCursor)
        
        # 使用 get_selection_pixmap 获取 QPixmap
        pixmap = self.get_selection_pixmap()
        QToolTip.showText(QCursor.pos(), "正在进行 AI 识别与处理，请稍候...", self, QRect(), 3000)
        self.ai_worker = AIWorker(pixmap, mode)
        self.ai_worker.finished.connect(self.show_ai_result)
        self.ai_worker.start()

    def show_ai_result(self, text):
        # 恢复鼠标状态
        self.setCursor(Qt.CursorShape.ArrowCursor)
        
        title = "识别结果" if "【译文" not in text else "翻译结果"
        dialog = ResultDialog(title, text, self)
        dialog.show()

    def get_selection_pixmap(self):
        # 1. 获取标准化选区
        selection_rect = self.selection_rect.normalized()
        if selection_rect.isEmpty():
            return QPixmap()

        # 2. 核心：直接在全屏底图上切一刀
        crop_pixmap = self.full_screen_pixmap.copy(selection_rect)
        
        # 3. 绘制标注 (如果存在) - 纯 Qt 操作
        if self.draw_objects:
            painter = QPainter(crop_pixmap)
            painter.setRenderHint(QPainter.RenderHint.Antialiasing)
            painter.translate(-selection_rect.topLeft())
            self.draw_annotations(painter, full_img_rect=True)
            painter.end()
        
        return crop_pixmap

    def share_image(self):
        if not self.has_selection: return
        
        # 1. 获取裁剪后的 QPixmap
        pixmap = self.get_selection_pixmap()
        
        # 2. 直接写入剪贴板 (Qt 原生操作)
        clipboard = QApplication.clipboard()
        clipboard.setPixmap(pixmap)
        
        QToolTip.showText(QCursor.pos(), "已复制图片到剪贴板！", self)

    def finish_capture(self):
        if self.has_selection:
            pixmap = self.get_selection_pixmap()
            clipboard = QApplication.clipboard()
            clipboard.setPixmap(pixmap)
        self.close_session()

    def save_image(self):
        if not self.has_selection: return
        file_path, _ = QFileDialog.getSaveFileName(self, "保存截图", "screenshot.png", "Images (*.png *.jpg)")
        if file_path:
            pixmap = self.get_selection_pixmap()
            pixmap.save(file_path)
            self.close_session()

    def close_session(self):
        """仅关闭当前截图会话，不退出程序"""
        self.close()
        self.toolbar.close()
        # 强制释放鼠标和键盘抓取，防止假死
        self.releaseMouse()
        self.releaseKeyboard()
        # V8.0 Fix: Do NOT call QApplication.quit()

    def keyPressEvent(self, event):
        if event.key() == Qt.Key.Key_Escape:
            self.close_session()  # 确保调用完全退出的逻辑
        if self.current_draw and self.current_draw.dtype == ToolType.TEXT and event.key() == Qt.Key.Key_Return:
             if not (event.modifiers() & Qt.KeyboardModifier.ControlModifier):
                 self.finish_text_edit()

    def mousePressEvent(self, event):
        if event.button() == Qt.MouseButton.LeftButton:
            if not self.has_selection:
                self.start_pos = event.pos()
                self.is_selecting = True
                self.selection_rect = QRect()
                self.toolbar.hide()
            else:
                if self.tool_type != ToolType.NONE:
                    if self.selection_rect.contains(event.pos()):
                        if self.tool_type == ToolType.TEXT:
                            self.start_text_edit(event.pos())
                        else:
                            self.current_draw = DrawObject(self.tool_type, event.pos())
                            self.draw_objects.append(self.current_draw)

    def mouseMoveEvent(self, event):
        if self.is_selecting:
            self.end_pos = event.pos()
            self.selection_rect = QRect(self.start_pos, self.end_pos).normalized()
            self.update()
        elif self.has_selection and self.current_draw:
            if self.current_draw.dtype == ToolType.PEN or self.current_draw.dtype == ToolType.MOSAIC:
                self.current_draw.points.append(event.pos())
            else:
                self.current_draw.end_pt = event.pos()
            self.update()

    def mouseReleaseEvent(self, event):
        if event.button() == Qt.MouseButton.LeftButton:
            if self.is_selecting:
                self.is_selecting = False
                if self.selection_rect.width() > 10 and self.selection_rect.height() > 10:
                    self.has_selection = True
                    self.show_toolbar()
                else:
                    self.has_selection = False
                    self.selection_rect = QRect()
            elif self.current_draw:
                self.current_draw = None

    def mouseDoubleClickEvent(self, event):
        if self.has_selection and self.selection_rect.contains(event.pos()):
            self.finish_capture()

    def show_toolbar(self):
        self.toolbar.adjustSize() 
        tr_x = self.selection_rect.right() - self.toolbar.width()
        tr_y = self.selection_rect.bottom() + 10
        screen_geo = self.geometry()
        
        if tr_y + self.toolbar.height() > screen_geo.bottom():
            tr_y = self.selection_rect.top() - self.toolbar.height() - 10
        if tr_x < screen_geo.left():
            tr_x = screen_geo.left()
        if tr_x + self.toolbar.width() > screen_geo.right():
            tr_x = screen_geo.right() - self.toolbar.width()
            
        self.toolbar.move(tr_x, tr_y)
        self.toolbar.show()
        self.toolbar.raise_()

    def start_text_edit(self, pos):
        if self.text_input.isVisible(): self.finish_text_edit()
        self.current_draw = DrawObject(ToolType.TEXT, pos)
        self.draw_objects.append(self.current_draw)
        self.text_input.move(pos)
        self.text_input.resize(200, 50)
        self.text_input.clear()
        self.text_input.show()
        self.text_input.setFocus()

    def finish_text_edit(self):
        if self.text_input.isVisible() and self.current_draw:
            text = self.text_input.toPlainText()
            if text:
                self.current_draw.text = text
                self.current_draw.end_pt = QPoint(self.current_draw.start_pt.x() + 200, self.current_draw.start_pt.y() + 50) 
            else:
                if self.current_draw in self.draw_objects:
                    self.draw_objects.remove(self.current_draw)
            self.text_input.hide()
            self.current_draw = None
            self.update()

    def paintEvent(self, event):
        painter = QPainter(self)
        painter.setRenderHint(QPainter.RenderHint.Antialiasing)
        painter.drawPixmap(0, 0, self.full_screen_pixmap)
        mask_color = QColor(0, 0, 0, 100)
        
        if not self.has_selection and not self.is_selecting:
            painter.fillRect(self.rect(), mask_color)
        else:
            r = QRegion(self.rect())
            r = r.subtracted(QRegion(self.selection_rect))
            painter.setClipRegion(r)
            painter.fillRect(self.rect(), mask_color)
            painter.setClipRegion(QRegion(self.rect())) 
            
            pen = QPen(QColor("#00BFFF"), 2)
            painter.setPen(pen)
            painter.setBrush(Qt.BrushStyle.NoBrush)
            painter.drawRect(self.selection_rect)
            self.draw_annotations(painter)

    def draw_annotations(self, painter, full_img_rect=False):
        if not full_img_rect:
            painter.setClipRect(self.selection_rect)
            
        for obj in self.draw_objects:
            pen = QPen(obj.color, obj.width)
            pen.setCapStyle(Qt.PenCapStyle.RoundCap)
            pen.setJoinStyle(Qt.PenJoinStyle.RoundJoin)
            painter.setPen(pen)
            painter.setBrush(Qt.BrushStyle.NoBrush)
            
            if obj.dtype == ToolType.RECTANGLE:
                painter.drawRect(QRect(obj.start_pt, obj.end_pt).normalized())
            elif obj.dtype == ToolType.ELLIPSE:
                painter.drawEllipse(QRect(obj.start_pt, obj.end_pt).normalized())
            elif obj.dtype == ToolType.ARROW:
                self.draw_arrow(painter, obj.start_pt, obj.end_pt)
            elif obj.dtype == ToolType.PEN:
                if len(obj.points) > 1:
                    path = QPainterPath()
                    path.moveTo(QPointF(obj.points[0]))
                    for p in obj.points[1:]: path.lineTo(QPointF(p))
                    painter.drawPath(path)
            elif obj.dtype == ToolType.MOSAIC:
                mosaic_pen = QPen(Qt.GlobalColor.lightGray, 15)
                mosaic_pen.setCapStyle(Qt.PenCapStyle.RoundCap)
                painter.setPen(mosaic_pen)
                if len(obj.points) > 1:
                    path = QPainterPath()
                    path.moveTo(QPointF(obj.points[0]))
                    for p in obj.points[1:]: path.lineTo(QPointF(p))
                    painter.drawPath(path)
            elif obj.dtype == ToolType.TEXT:
                font = painter.font()
                font.setPointSize(16)
                font.setBold(True)
                painter.setFont(font)
                painter.setPen(Qt.GlobalColor.red)
                painter.drawText(obj.start_pt, obj.text)

    def draw_arrow(self, painter, start, end):
        line_vec = QPointF(end) - QPointF(start)
        length = (line_vec.x()**2 + line_vec.y()**2)**0.5
        if length == 0: return
        unit_vec = line_vec / length
        arrow_size = 15
        angle = 0.5 
        painter.drawLine(start, end)
        arrow_head = QPolygonF()
        arrow_head.append(QPointF(end))
        vx, vy = unit_vec.x(), unit_vec.y()
        import math
        cos_a = math.cos(angle)
        sin_a = math.sin(angle)
        rvx, rvy = -vx, -vy
        w1x = rvx * cos_a - rvy * sin_a
        w1y = rvx * sin_a + rvy * cos_a
        p_w1 = QPointF(end) + QPointF(w1x * arrow_size, w1y * arrow_size)
        w2x = rvx * cos_a + rvy * sin_a
        w2y = -rvx * sin_a + rvy * cos_a
        p_w2 = QPointF(end) + QPointF(w2x * arrow_size, w2y * arrow_size)
        arrow_head.append(p_w1)
        arrow_head.append(p_w2)
        painter.setBrush(painter.pen().color())
        painter.drawPolygon(arrow_head)

def main():
    app_name = "SuperCapture_V8.0"
    tmp = QDir.tempPath()
    lock_file = QLockFile(os.path.join(tmp, f"{app_name}.lock"))
    if not lock_file.tryLock(100):
        print("Another instance is running.")
        return

    app = QApplication(sys.argv)
    app.setHighDpiScaleFactorRoundingPolicy(Qt.HighDpiScaleFactorRoundingPolicy.Floor)
    app.setQuitOnLastWindowClosed(False)
    app.setWindowIcon(create_default_icon())

    class SignalWorker(QWidget):
        trigger = pyqtSignal()
        def __init__(self):
            super().__init__()
            self.trigger.connect(self.launch_overlay)
            self.overlay = None
        def launch_overlay(self):
            if self.overlay:
                self.overlay.close()
                self.overlay = None
            QApplication.processEvents()
            time.sleep(0.1)
            self.overlay = CaptureOverlay()
            self.overlay.showFullScreen()
            self.overlay.setFocus()
            self.overlay.activateWindow()

    worker = SignalWorker()
    
    def on_activate():
        worker.trigger.emit()

    try:
        hotkey_listener = keyboard.GlobalHotKeys({
            '<alt>+q': on_activate
        })
        hotkey_listener.start()
    except Exception as e:
        print(f"Hotkey registration failed: {e}")

    print("【SC V8.0 Final】已就绪，请按 Alt + Q 进行截图。")
    
    # -----------------------------------------------------------
    # 性能优化：预加载 EasyOCR 模型 (Preload Model)
    # -----------------------------------------------------------
    def preload_model():
        global ocr_reader
        try:
            print("INFO: Preloading EasyOCR model in background...")
            # 即使没有 GPU，提前加载也能避免首次调用的延迟
            ocr_reader = easyocr.Reader(['ch_sim', 'en'], gpu=False)
            print("INFO: EasyOCR model loaded successfully.")
        except Exception as e:
            print(f"ERROR: Failed to preload EasyOCR model: {e}")

    import threading
    threading.Thread(target=preload_model, daemon=True).start()
    
    # 托盘图标设置
    tray = QSystemTrayIcon(create_default_icon(), app)
    tray.setToolTip("SuperCapture V8.0 (Alt+Q)")
    menu = QMenu()
    menu.setStyleSheet("""
        QMenu {
            background-color: white;
            border: 1px solid #dcdcdc;
            padding: 5px;
        }
        QMenu::item {
            padding: 8px 20px;
            font-size: 14px;
        }
        QMenu::item:selected {
            background-color: #e6f7ff;
        }
    """)
    
    # 【强制唤醒】立即截图
    capture_action = QAction("⚡ 立即截图 (Capture Now)", app)
    capture_action.triggered.connect(lambda: worker.trigger.emit())
    menu.addAction(capture_action)
    
    menu.addSeparator()
    
    quit_action = QAction("❌ 退出程序 (Exit App)", app)
    quit_action.triggered.connect(app.quit)
    menu.addAction(quit_action)
    
    tray.setContextMenu(menu)
    tray.show()
    
    exit_code = app.exec()
    hotkey_listener.stop()
    lock_file.unlock()
    sys.exit(exit_code)

if __name__ == "__main__":
    main()
