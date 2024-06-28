const $guessForm = $('#guess-form');
let userScore = 0;
let $msg = $('.msg');
const $submitBtn = $('#submit-btn');
let words = [];

$guessForm.on('submit', async function(e){
    // handle form submission

    // prevent page refresh upon form submission
    e.preventDefault();
    
    // send word to server to see if it's a valid word in the dictionary / on board
    const userGuess = $('#user-guess').val();
    
    // if user submits form without entering, any input, display message and return
    if (userGuess == ''){
        $msg.text("Invalid - Empty input. Please enter a word.");
        $msg.attr('id', 'empty-msg');
        return;
    }

    // if user guesses a word that has already been guessed, display message and return 
    if(words.includes(userGuess)){
        $msg.text("You have already entered this word. Please enter another word.");
        $msg.attr('id', 'already-guessed-msg');
        // clear form input 
        $('#user-guess').val('');
        return;
    }

    const response = await axios({
        method: 'post',
        url: '/check-word',
        data:{userGuess: userGuess}
    });

    result = response.data['result'];

    // show message to user based on response received from server, keep score if word is valid
    if(result == 'ok'){
        $msg.text("Nice work!.");
        $msg.attr('id', 'ok-msg');
        // add to score if guess is valid 
        let wordScore = userGuess.length;
        userScore += wordScore;
        $('#current-score').text(`Current Score: ${userScore}`);
        // add to list of words already guessed
        words.push(userGuess);
    }
    if(result == 'not-word'){
        $msg.text("That is not a valid word. Please try again.");
        $msg.attr('id', 'not-word-msg');
    }
    if(result == 'not-on-board'){
        $msg.text("That word is not on the board. Please try again.");
        $msg.attr('id', 'not-on-board-msg');
    }

    // clear input text box after form submitted
    $('#user-guess').val('');
});

// end game after 60 seconds 
setTimeout(async function endGame(){
    // disable submit button 
    $submitBtn.attr('disabled', true);
    // show GAME OVER message to user 
    $msg.text("GAME OVER");
    $msg.attr('id', 'game-over-msg');
    
    // send user score to back end 
   await axios({
        method: 'post',
        url: '/update-stats',
        data: {userScore: userScore}
    });
}, 60000);

