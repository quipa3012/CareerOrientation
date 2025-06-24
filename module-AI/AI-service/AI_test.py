from flask import Flask, request, jsonify
import joblib
import numpy as np

# Load model
model = joblib.load('../train/models/naive_bayes_model.joblib')

# Tạo Flask app
app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Nhận dữ liệu JSON từ client
        data = request.get_json()

        # Chuyển input thành mảng numpy 2D
        features = np.array([list(data.values())])

        # Dự đoán
        prediction = model.predict(features)[0]

        # Trả kết quả về client
        return jsonify({'prediction': int(prediction)})

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
