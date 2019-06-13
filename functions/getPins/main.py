import flask
import requests

def getPins(request):
    pins = [
        {"x": 2, "y": 3},
        {"x": 5, "y": 6}
    ]
    return flask.jsonify(pins)

