from flask import Flask, request, jsonify
import joblib
import numpy as np

# Load scaler và pipeline
scaler = joblib.load('../train/models/scaler_nb_v2.joblib')
pipeline = joblib.load('../train/models/naive_bayes_pipeline_v2.joblib')
print(pipeline)

# Tạo Flask app
app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Nhận dữ liệu JSON từ client
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data received'}), 400

        # Chuyển input thành mảng numpy 2D
        features = np.array([list(data.values())])

        # Scale dữ liệu (nếu cần)
        features_scaled = scaler.transform(features)

        # Dự đoán bằng pipeline
        prediction = pipeline.predict(features_scaled)[0]

        # Trả kết quả về client
        return jsonify({'prediction': int(prediction)})

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
