from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)

RECORD_FILE = "data/record.json"


@app.route("/")
def index():
    return render_template("index.html")


@app.get("/get-record")
def get_record():
    try:
        with open(RECORD_FILE, "r", encoding="utf-8") as file:
            return jsonify(json.load(file))
    except (FileNotFoundError, json.JSONDecodeError):
        return jsonify({"bestScore": 0})


@app.post("/save-record")
def save_record():
    data = request.get_json()

    with open(RECORD_FILE, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4)

    return jsonify({"success": True})


if __name__ == "__main__":
    app.run(debug=True)
