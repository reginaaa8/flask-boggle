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
    # initialize plays in session - keep track of number of times user plays
    if 'times_played' not in session:
        session['times_played'] = 0
    #initialize high score in session - keep track of users highest score
    if 'high_score' not in session:
        session['high_score'] = 0
    
    return render_template('board.html', board=board, high_score=session['high_score'])

@app.route('/check-word', methods=['POST'])
def check_word():
    '''check if the word the user guessed is a valid word from the dictionary and on game board'''
    user_guess = request.get_json()['userGuess']
    board = session['board']

    result = boggle_game.check_valid_word(board, user_guess)

    return jsonify({'result': result})

@app.route('/update-stats', methods=['POST'])
def update_stats():
    '''update high score and number of times user has played'''
    # increment number of times played
    session['times_played'] += 1
    userScore = request.get_json()['userScore']
    # update high score if user beat high score 
    if session['high_score'] < userScore:
        session['high_score'] = userScore
    
    return jsonify({'high_score': session['high_score'], 'times_played': session['times_played']})

    





    
    
