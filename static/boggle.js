class BoggleGame{
    constructor(){
        // initialize properties 
        this.$guessForm = $('#guess-form');
        this.userScore = 0;
        this.$msg = $('.msg');
        this.$submitBtn = $('#submit-btn');
        this.words = [];
        // set up event listeners 
        this.$guessForm.on('submit', this.handleFormSubmit.bind(this));
        this.endGameAfterTimeout();
    }
    
    async handleFormSubmit(e){
        // handle form submission

        // prevent page refresh upon form submission
        e.preventDefault();
    
        // send word to server to see if it's a valid word in the dictionary / on board
        const userGuess = $('#user-guess').val();
    
        // if user submits form without entering, any input, display message and return
        if (userGuess == ''){
            this.$msg.text("Invalid - Empty input. Please enter a word.");
            this.$msg.attr('id', 'empty-msg');
            return;
        }

        // if user guesses a word that has already been guessed, display message and return 
        if(this.words.includes(userGuess)){
            this.$msg.text("You have already entered this word. Please enter another word.");
            this.$msg.attr('id', 'already-guessed-msg');
            // clear form input 
            $('#user-guess').val('');
            return;
        }

        const response = await axios({
            method: 'post',
            url: '/check-word',
            data:{userGuess: userGuess}
        });

        const result = response.data['result'];

        // show message to user based on response received from server, keep score if word is valid
        if(result == 'ok'){
            this.$msg.text("Nice work!.");
            this.$msg.attr('id', 'ok-msg');
            // add to score if guess is valid 
            let wordScore = userGuess.length;
            this.userScore += wordScore;
            $('#current-score').text(`Current Score: ${this.userScore}`);
            // add to list of words already guessed
            this.words.push(userGuess);
        }
        else if(result == 'not-word'){
            this.$msg.text("That is not a valid word. Please try again.");
            this.$msg.attr('id', 'not-word-msg');
        }
        else if(result == 'not-on-board'){
            this.$msg.text("That word is not on the board. Please try again.");
            this.$msg.attr('id', 'not-on-board-msg');
        }

        // clear input text box after form submitted
        $('#user-guess').val('');
    };

    endGameAfterTimeout(){
        // end game after 60 seconds 
        const self = this;
        setTimeout(async function(){
        // disable submit button 
        self.$submitBtn.attr('disabled', true);
        // show GAME OVER message to user 
        self.$msg.text("GAME OVER");
        self.$msg.attr('id', 'game-over-msg');
    
        // send user score to back end 
        const response = await axios({
            method: 'post',
            url: '/update-stats',
            data: {userScore: self.userScore}
        });
        // show high score 
        const highScore = response.data['high_score'];
        $('#high-score').text(`High Score: ${highScore}`);
        // show number of times user has played 
        const timesPlayed = response.data['times_played'];
        $('#num-plays').text(`Number of plays: ${timesPlayed}`);
    }, 10000);
    }

}

// run new instance of game when DOM loaded
$(document).ready(new BoggleGame());
