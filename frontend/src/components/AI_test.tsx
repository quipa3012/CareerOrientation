import React, { useState } from 'react';
import axios from 'axios';

const PredictForm: React.FC = () => {
    const [formData, setFormData] = useState<{ [key: string]: number }>(
        Object.fromEntries(Array.from({ length: 61 }, (_, i) => [`feature${i + 1}`, 1]))
    );

    const [result, setResult] = useState<number | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8080/api/predict', formData);
            setResult(res.data.prediction ?? res.data); // dự phòng 2 kiểu response
        } catch (err) {
            console.error('Prediction failed:', err);
            setResult(null);
        }
    };

    return (
        <div className="p-4 max-w-5xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Dự đoán ngành học từ 61 feature</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
                {Object.keys(formData).map((key) => (
                    <div key={key} className="flex flex-col">
                        <label className="text-sm font-medium mb-1">{key}</label>
                        <select
                            name={key}
                            value={formData[key]}
                            onChange={handleChange}
                            className="border rounded p-1"
                        >
                            {[0, 1, 2, 3, 4, 5].map(val => (
                                <option key={val} value={val}>
                                    {val}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
                <div className="col-span-3">
                    <button
                        type="submit"
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Gửi dự đoán
                    </button>
                </div>
            </form>

            {result !== null && (
                <div className="mt-6 text-lg">
                    ✅ Kết quả dự đoán: <strong>{result}</strong>
                </div>
            )}
        </div>
    );
};

export default PredictForm;
