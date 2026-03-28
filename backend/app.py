from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from datetime import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB Configuration
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/nextea')
client = MongoClient(MONGO_URI)
db = client['nextea']

# ====================== TEA ENDPOINTS ====================== 

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'NexTEA Backend is running',
        'timestamp': datetime.now().isoformat()
    }), 200

@app.route('/api/teas', methods=['GET'])
def get_teas():
    """Get all teas"""
    try:
        teas = list(db.teas.find({}, {'_id': 0}))
        return jsonify({'success': True, 'data': teas}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/teas/<tea_id>', methods=['GET'])
def get_tea(tea_id):
    """Get specific tea by ID"""
    try:
        from bson.objectid import ObjectId
        tea = db.teas.find_one({'_id': ObjectId(tea_id)})
        if not tea:
            return jsonify({'success': False, 'error': 'Tea not found'}), 404
        tea['_id'] = str(tea['_id'])
        return jsonify({'success': True, 'data': tea}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/teas', methods=['POST'])
def create_tea():
    """Create new tea"""
    try:
        data = request.get_json()
        data['created_at'] = datetime.now()
        result = db.teas.insert_one(data)
        return jsonify({'success': True, 'id': str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/teas/<tea_id>', methods=['PUT'])
def update_tea(tea_id):
    """Update tea"""
    try:
        from bson.objectid import ObjectId
        data = request.get_json()
        data['updated_at'] = datetime.now()
        result = db.teas.update_one({'_id': ObjectId(tea_id)}, {'$set': data})
        if result.matched_count == 0:
            return jsonify({'success': False, 'error': 'Tea not found'}), 404
        return jsonify({'success': True, 'message': 'Tea updated'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/teas/<tea_id>', methods=['DELETE'])
def delete_tea(tea_id):
    """Delete tea"""
    try:
        from bson.objectid import ObjectId
        result = db.teas.delete_one({'_id': ObjectId(tea_id)})
        if result.deleted_count == 0:
            return jsonify({'success': False, 'error': 'Tea not found'}), 404
        return jsonify({'success': True, 'message': 'Tea deleted'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ====================== ERROR HANDLERS ====================== 

@app.errorhandler(404)
def not_found(e):
    return jsonify({'success': False, 'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(e):
    return jsonify({'success': False, 'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)