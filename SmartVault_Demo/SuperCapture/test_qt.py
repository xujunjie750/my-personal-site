from PyQt6.QtWidgets import QApplication, QLabel
import sys

app = QApplication(sys.argv)
app.setQuitOnLastWindowClosed(False)
print("Running test...")
app.exec()
print("Finished")
