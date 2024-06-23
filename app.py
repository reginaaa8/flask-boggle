from boggle import Boggle
from flask import Flask, render_template, request, session, jsonify

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secretkey'

boggle_game = Boggle()

@app.route('/')
def show_board():
    '''show boggle board'''
    board = boggle_game.make_board()
    session['board'] = board

    return render_template('board.html', board=board)

@app.route('/check-word', methods=['POST'])
def check_word():
    '''check if the word the user guessed is a valid word from the dictionary and on game board'''
    user_guess = request.get_json()['userGuess']
    board = session['board']

    result = boggle_game.check_valid_word(board, user_guess)
    
    return jsonify({'result': result})




    
    
