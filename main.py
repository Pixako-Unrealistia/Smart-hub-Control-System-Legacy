import json
from PySide6.QtWidgets import QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, QPushButton, QLabel, QLineEdit, QGridLayout, QMessageBox, QInputDialog, QFileDialog
from PySide6.QtCore import Qt, QSize, QEvent
import sys

class Meter:
	def __init__(self, meter_id, display_name):
		self.meter_id = meter_id
		self.display_name = display_name
		self.data = []
		self.state = False
		self.label = QLabel(display_name)
		self.label.setFixedSize(QSize(100, 100))
		self.update_label_color()

	def update_label_color(self):
		color = "green" if self.state else "lightblue"
		self.label.setStyleSheet(f"background-color: {color}; border: 1px solid black;")

	def toggle_state(self):
		self.state = not self.state
		self.update_label_color()

	def to_dict(self):
		return {
			"meter_id": self.meter_id,
			"display_name": self.display_name,
			"data": self.data,
			"state": self.state
		}

	@classmethod
	def from_dict(cls, data):
		meter = cls(data["meter_id"], data["display_name"])
		meter.data = data["data"]
		meter.state = data["state"]
		meter.label = QLabel(meter.display_name)
		meter.label.setFixedSize(QSize(100, 100))
		meter.update_label_color()
		return meter

class MainWindow(QMainWindow):
	def __init__(self):
		super().__init__()
		self.setWindowTitle("Smart Hub")
		screen = QApplication.primaryScreen().availableGeometry()
		self.setGeometry(0, 0, screen.width() * 0.8, screen.height() * 0.8)

		self.central_widget = QWidget()
		self.setCentralWidget(self.central_widget)

		self.layout = QVBoxLayout(self.central_widget)

		self.search_bar = QLineEdit()
		self.search_bar.setPlaceholderText("Search by name or ID...")
		self.search_bar.textChanged.connect(self.search_meters)
		self.layout.addWidget(self.search_bar)

		self.button_layout = QHBoxLayout()
		self.layout.addLayout(self.button_layout)

		self.add_button = QPushButton("Add Meter")
		self.add_button.clicked.connect(self.add_meter)
		self.button_layout.addWidget(self.add_button)

		self.save_button = QPushButton("Save Configuration")
		self.save_button.clicked.connect(self.save_configuration)
		self.button_layout.addWidget(self.save_button)

		self.load_button = QPushButton("Load Configuration")
		self.load_button.clicked.connect(self.load_configuration)
		self.button_layout.addWidget(self.load_button)

		self.meter_layout = QGridLayout()
		self.layout.addLayout(self.meter_layout)

		self.navigation_layout = QHBoxLayout()
		self.prev_button = QPushButton("Previous")
		self.prev_button.clicked.connect(self.prev_page)
		self.next_button = QPushButton("Next")
		self.next_button.clicked.connect(self.next_page)
		self.navigation_layout.addWidget(self.prev_button)
		self.navigation_layout.addWidget(self.next_button)
		self.layout.addLayout(self.navigation_layout)

		self.meters = []
		self.filtered_meters = []
		self.current_page = 0
		self.meters_per_page = 9

		self.update_display()

	def add_meter(self):
		meter_id, ok = QInputDialog.getText(self, "Add Meter", "Enter Meter ID:")
		if not ok or not meter_id:
			return

		# Debug
		if meter_id == "ADMIN":
			for i in range(100):
				display_name = f"Meter {len(self.meters) + 1}"
				#name should be like MAC000313 (dynamic start from 1 with zero padding)
				
				meter = Meter(f"MAC{str(i+1).zfill(6)}", display_name)
				meter.label.installEventFilter(self)
				self.meters.append(meter)
				self.filtered_meters = self.meters
				self.update_display()
			return

		if any(meter.meter_id == meter_id for meter in self.meters):
			QMessageBox.warning(self, "Warning", "Meter ID must be unique!")
			return

		display_name = f"Meter {len(self.meters) + 1}"
		meter = Meter(meter_id, display_name)
		meter.label.installEventFilter(self)
		self.meters.append(meter)
		self.filtered_meters = self.meters
		self.update_display()

	def eventFilter(self, source, event):
		if event.type() == QEvent.Enter and isinstance(source, QLabel):
			for meter in self.meters:
				if meter.label == source:
					source.setText(f"ID: {meter.meter_id}")
					break
		elif event.type() == QEvent.Leave and isinstance(source, QLabel):
			for meter in self.meters:
				if meter.label == source:
					source.setText(meter.display_name)
					break
		elif event.type() == QEvent.MouseButtonPress and isinstance(source, QLabel):
			for meter in self.meters:
				if meter.label == source:
					meter.toggle_state()
					break
		return super().eventFilter(source, event)

	def update_display(self):
		for i in reversed(range(self.meter_layout.count())):
			self.meter_layout.itemAt(i).widget().setParent(None)

		start_index = self.current_page * self.meters_per_page
		end_index = start_index + self.meters_per_page
		for i, meter in enumerate(self.filtered_meters[start_index:end_index]):
			self.meter_layout.addWidget(meter.label, i // 3, i % 3)

		self.prev_button.setEnabled(self.current_page > 0)
		self.next_button.setEnabled(end_index < len(self.filtered_meters))

	def search_meters(self):
		search_text = self.search_bar.text().lower()
		self.filtered_meters = [meter for meter in self.meters if search_text in meter.display_name.lower() or search_text in meter.meter_id.lower()]
		self.current_page = 0
		self.update_display()

	def next_page(self):
		if (self.current_page + 1) * self.meters_per_page < len(self.filtered_meters):
			self.current_page += 1
			self.update_display()

	def prev_page(self):
		if self.current_page > 0:
			self.current_page -= 1
			self.update_display()

	def save_configuration(self):
		file_path, _ = QFileDialog.getSaveFileName(self, "Save Configuration", "", "JSON Files (*.json)")
		if not file_path:
			return

		data = [meter.to_dict() for meter in self.meters]
		with open(file_path, 'w') as file:
			json.dump(data, file)

	def load_configuration(self):
		file_path, _ = QFileDialog.getOpenFileName(self, "Load Configuration", "", "JSON Files (*.json)")
		if not file_path:
			return

		with open(file_path, 'r') as file:
			data = json.load(file)

		self.meters = [Meter.from_dict(meter_data) for meter_data in data]
		for meter in self.meters:
			meter.label.installEventFilter(self)
		self.filtered_meters = self.meters
		self.update_display()

if __name__ == "__main__":
	app = QApplication(sys.argv)
	window = MainWindow()
	window.show()
	sys.exit(app.exec())


# 
# from flask import Flask, jsonify
# app = Flask(__name__)
# 
# @app.route('/meters', methods=['GET'])
# def get_meters():
#     data = [meter.to_dict() for meter in meters]
#     return jsonify(data)
# 
# if __name__ == '__main__':
#     app.run(debug=True)