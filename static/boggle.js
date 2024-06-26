const $guessForm = $('#guess-form');

$guessForm.on('submit', async function(e){
    // handle form submission

    // prevent page refresh upon form submission
    e.preventDefault();
    
    // send word to server to see if it's a valid word in the dictionary / on board
    const userGuess = $('#user-guess').val();
    
    // if user submits form without entering, any input, display message and return
   
    let $msg = $('.msg');
    if (userGuess == ''){
        $msg.text("Invalid - Empty input. Please enter a word.");
        $msg.attr('id', 'empty-msg');
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

