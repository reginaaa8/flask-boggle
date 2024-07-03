from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle

class FlaskTests(TestCase):

    def setUp(self):
       '''do before every test'''
       app.config['TESTING'] = True

    def test_show_board(self):
      '''make sure board loads with session data'''
      with app.test_client() as client:
         res = client.get('/')
         html = res.get_data(as_text=True)

         self.assertEqual(res.status_code, 200)
         self.assertIn('<h1>Boggle</h1>', html)
         self.assertIn('board', session)
         self.assertIn('times_played', session)
         self.assertIn('high_score', session)
    
    def test_check_word(self):
      '''ensure expected response received from a users guess'''
      with app.test_client() as client:
        with client.session_transaction() as test_session:
            # set board for test session
            test_session['board'] = [
               ['A', 'D', 'F', 'L', 'G'],
               ['F', 'L', 'O', 'G', 'I'],
               ['C', 'D', 'L', 'M', 'N'],
               ['E', 'R', 'S', 'O', 'F'],
               ['M', 'I', 'T', 'G', 'W']
                ]
        res = client.post('/check-word', json={'userGuess' : 'fog'})
        
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json['result'], 'ok') # 'fog' is on the board, should be ok

    def test_stats(self):
       '''test route to update stats'''
       with app.test_client() as client:
          with client.session_transaction() as test_session:
             # set high score and number of times played for test session
             test_session['high_score'] = 20
             test_session['times_played'] = 0
          res = client.post('/update-stats', json={'userScore' : 25})

          self.assertEqual(res.status_code, 200)
          self.assertEqual(res.json['high_score'], 25) # high score should update to 25 since higher than current high score in session
          self.assertEqual(res.json['times_played'], 1) # number of times played should increment by one
            

         

