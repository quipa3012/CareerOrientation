from flask import Flask, request, jsonify
import joblib
import numpy as np

scaler = joblib.load('../train/models/scaler_nb_v2.joblib')
model = joblib.load('../train/models/naive_bayes_v2.joblib')

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data received'}), 400

        features = np.array([list(data.values())])

        features_scaled = scaler.transform(features)

        prediction = model.predict(features_scaled)[0]

        return jsonify({'prediction': int(prediction)})

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
