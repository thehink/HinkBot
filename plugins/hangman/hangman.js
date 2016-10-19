
class Hangman{
  constructor(word){
    this.reset(word);
  }

  reset(word){
    this.maxLives = word.length + 5;
    this.lives = this.maxLives;
    this.usedLetters = [];
    this.word = word.toUpperCase().split('');
    this.solved = false;
    this.gameOver = false;
  }

  guess(letters){
    letters = letters.toUpperCase();

    if(letters.length > 1){
      if(letters === this.word.join('')){
        this.solved = true;
        this.gameOver = true;
        return 'You solved it :)';
      }else{
        this.lives--;
        return 'Wrong word!';
      }
    }else{
      if(this.usedLetters.indexOf(letters) > -1){
        return 'You already tried this letter!';
      }

      this.usedLetters.push(letters);



      if(this.word.indexOf(letters) > -1){
        let finished = this.word.every(letter => {
          return this.usedLetters.indexOf(letter) > -1;
        });

        if(finished){
          this.solved = true;
          this.gameOver = true;
          return 'You won!';
        }

        return 'Added letter!';
      }else{
        this.lives--;
        if(this.lives < 0){
          this.gameOver = true;
          return 'Youre out of lives!';
        }
        return 'Wrong letter!';
      }
    }
  }

  getStatus(){
    if(this.solved){
      return 'Congrats, Word is ' + this.word.join('');
    }

    if(this.gameOver){
      return 'You lost and cant guess anymore! The word was: ' + this.word.join('');
    }

    let hiddenWord = this.word.map(letter => {
      return this.usedLetters.indexOf(letter) > -1 ? letter : '\\_';
    }).join(' ');

    return `Progress: ${hiddenWord}  Lives: ${this.lives}, Used(${this.usedLetters.join(', ')})`;
  }
}

module.exports = Hangman
