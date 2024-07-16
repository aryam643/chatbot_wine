from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os

app = Flask(__name__)
CORS(app)

# Set the OpenAI API key here for testing
openai.api_key = os.getenv('OPENAI_API_KEY')

# Load corpus with UTF-8 encoding
with open('corpus.txt', 'r', encoding='utf-8') as file:
    corpus = file.read()

@app.route('/')
def index():
    return "Wine Chatbot API is running. Use the /api/chat endpoint to interact with the chatbot."

@app.route('/api/chat', methods=['GET', 'POST'])
def chat():
    if request.method == 'GET':
        return "This endpoint is used for chat interaction. Please use POST method to send messages."

    try:
        user_message = request.json.get('message')
        print(f"Received message: {user_message}")

        response = openai.Completion.create(
            engine="text-embedding-3-small",
            prompt=f"Use the following corpus to answer the question: {corpus}\nUser: {user_message}\nBot:",
            max_tokens=150
        )
        
        answer = response.choices[0].text.strip()
        print(f"Generated answer: {answer}")

        if "I don't know" in answer or "contact the business" in answer:
            answer = "Please contact the business directly for more information."

        return jsonify({'message': answer})

    except openai.error.OpenAIError as e:
        print(f"OpenAI API error: {e}")
        return jsonify({'message': f'OpenAI API error: {str(e)}'}), 500

    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({'message': f'An unexpected error occurred: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)
