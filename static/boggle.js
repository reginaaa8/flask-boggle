const $guessForm = $('#guess-form');

$guessForm.on('submit', async function(e){
    // handle form submission

    // prevent page refresh upon form submission
    e.preventDefault();
    
    // send word to server to see if it's a valid word in the dictionary / on board
    let userGuess = $('#user-guess').val();

    response = await axios({
        method: 'post',
        url: '/check-word',
        data:{userGuess: userGuess}
    });
    
});

