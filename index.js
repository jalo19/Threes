'use strict';

const PUZZLE_CONTAINER_LENGTH = 16;
let timer = null;

// Initializes game state
function renderInit() {
    // Removes all animation
    removeAnim();
    // Initialize the first required ones, twos, and threes tiles
    let oneLocation = assign(Math.floor(Math.random() * 16));
    let onePuzzle = $('.puzzle-container')[oneLocation];
    onePuzzle.classList.add('ones');
    let oneNum = createTileNum(1);
    onePuzzle.append(oneNum);

    let twoLocation = assign(Math.floor(Math.random() * 16));
    let twoPuzzle = $('.puzzle-container')[twoLocation];
    twoPuzzle.classList.add('twos');
    let twoNum = createTileNum(2);
    twoPuzzle.append(twoNum);

    let threeLocation = assign(Math.floor(Math.random() * 16));
    let threePuzzle = $('.puzzle-container')[threeLocation];
    threePuzzle.classList.add('threes');
    let threeNum = createTileNum(3);
    threePuzzle.append(threeNum);

    // Initialize the other tile types randomly
    for(let i = 0; i < 6; i++) {
        let location = assign(Math.floor(Math.random() * 16));
        let tileType = Math.floor(Math.random() * 3);
        let tile = $('.puzzle-container')[location];
        if(tileType == 0) {
            tile.classList.add('ones');
            let tempTileN = createTileNum(1);
            tile.append(tempTileN);
        } else if(tileType == 1) {
            tile.classList.add('twos');
            let tempTileN = createTileNum(2);
            tile.append(tempTileN);
        } else {
            tile.classList.add('threes');
            let tempTileN = createTileNum(3);
            tile.append(tempTileN);
        }
    }
    // Disable start button
    $('#start-game')[0].classList.remove('active');
    $('#start-game')[0].classList.add('disabled');
    $('#start-game').off('click');
}

// Returns a random tile location given a location 
function assign(location) {
    while($('.puzzle-container')[location].classList.length > 1) {
        location = Math.floor(Math.random() * 16);
    }
    return location;
}

// Creates and returns a tile's number based on num
function createTileNum(num) {
    let tile = document.createElement('span');
    tile.textContent = num;
    return tile;
}

// Returns whether a puzzle container (tile) is a tile
function isTile(tile) {
    return tile.classList.contains('ones') || tile.classList.contains('twos') || tile.classList.contains('threes') || tile.classList.contains('aboveThrees');
}

// Clones the given from tile into the given to tile
function cloneTile(to, from) {
    let tileClass = getTileProp(from);
    to.classList.add(tileClass);
    from.classList.remove(tileClass);
    to.append(from.firstChild);
}

// Empties the container associated with tile
function emptyContain(tile) {
    tile.classList.remove(getTileProp(tile));
    tile.removeChild(tile.firstChild);
}

// Gets the class of the given tile that gives it its tile property
function getTileProp(tile) {
    let tileClass = null;
    for(let i = 0; i < tile.classList.length; i++) {
        let tileProp = tile.classList[i];
        if(tileProp == 'ones' || tileProp == 'twos' || tileProp == 'threes'|| tileProp == 'aboveThrees') {
            tileClass = tileProp;
        }
    }
    return tileClass;
}

// Spawns a random tile at the given location
function spawnTile(location, nextTile, style) {
    let tileType = nextTile;
    let tile = $('.puzzle-container')[location];
    addAnim(tile, style);
    if(tileType == 0) {
        tile.classList.add('ones');
        tile.append(createTileNum(1));
    } else if(tileType == 1) {
        tile.classList.add('twos');
        tile.append(createTileNum(2));
    } else {
        tile.classList.add('threes');
        tile.append(createTileNum(3));
    }
}


// Given a tileType, returns a tile to be attached to the preview
function attachSmallTile(tileType) {
    let smallTile = document.createElement('div');
    smallTile.classList.add('small-tile');
    if(tileType == 0) {
        smallTile.classList.add('ones');
    } else if(tileType == 1) {
        smallTile.classList.add('twos');
    } else {
        smallTile.classList.add('threes');
    }
    return smallTile;
}

// Sets up and returns the timer for the game
function setTimer() {
    let elapsedSec = 0;
    let elapsedMin = 0;
    let elapsedHr = 0;
    return setInterval(function() {
        elapsedSec++;
        if(elapsedSec > 60) {
            elapsedMin = Math.floor(elapsedSec / 60);
            elapsedSec %= 60;
        }
        if(elapsedMin > 60) {
            elapsedHr = Math.floor(elapsedMin / 60);
            elapsedMin %= 60;
        }
        $('.display-time')[0].textContent = elapsedHr + " hr    " + elapsedMin + " min  " + elapsedSec + " sec";
    }, 1000);
}

// Returns whether the game is over
function isGameOver() {
    if(isFull()) {
        for(let i = 0; i < 4; i++) {
            for(let j = 0 + 4 * i; j < 4 * i + 4; j++) {
                let curTile = $('.puzzle-container')[j];
                let curTileNum = +curTile.firstChild.textContent;
                // For all tiles in rows 1 to 3
                if(i < 3) {
                    let downTile = $('.puzzle-container')[j + 4];
                    let downTileNum = +downTile.firstChild.textContent;
                    if(curTileNum + downTileNum == 3 || ((curTileNum >= 3 && downTileNum >= 3) && curTileNum == downTileNum)) {
                        return false;
                    }
                }
                // If it's not the last tile in row
                if(j < 4 * i + 3) {
                    let rightTile = $('.puzzle-container')[j + 1];
                    let rightTileNum = +rightTile.firstChild.textContent;
                    if(curTileNum + rightTileNum == 3 || ((curTileNum >= 3 && rightTileNum >= 3) && curTileNum == rightTileNum)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    return false;
}

// Returns whether the board is completely filled with tiles
function isFull() {
    for(let i = 0; i < PUZZLE_CONTAINER_LENGTH; i++) {
        if(!isTile($('.puzzle-container')[i])) {
            return false;
        }
    }
    return true;
}

// Gets the current game's score
function getScore() {
    let score = 0;
    for(let i = 0; i < PUZZLE_CONTAINER_LENGTH; i++) {
        let tile = $('.puzzle-container')[i];
        if(isTile(tile)) {
            let points = +tile.firstChild.textContent;
            score += points;
        }
    }
    return score;
}

// Clears the board
function clearBoard() {
    for(let i = 0; i < PUZZLE_CONTAINER_LENGTH; i++) {
        let tile = $('.puzzle-container')[i];
        if(isTile(tile)) {
            emptyContain(tile);
        }
    }
    $('.next-puzzle')[0].removeChild($('.next-puzzle')[0].childNodes[3]);
}

// Applies the given animation style to the given tile
function addAnim(tile, style) {
    tile.classList.add('animated', style);
}

// Removes animation from given tile
function removeAnimFrom(tile) {
    if(tile.classList.contains('animated')) {
        tile.classList.remove('animated', 'slideInRight', 'slideInLeft', 'slideInUp', 'slideInDown');
    }
}

// Removes animation from all tiles and containers
function removeAnim() {
    for(let i = 0; i < PUZZLE_CONTAINER_LENGTH; i++) {
        let tile = $('.puzzle-container')[i];
        removeAnimFrom(tile);
    }
}

function buttonClick() {
    // Initializes the game
    renderInit();
    // Initializes the preview tile container
    let nextTileNum = Math.floor(Math.random() * 3);
    let nextTile = attachSmallTile(nextTileNum);
    $('.next-puzzle').append(nextTile);
    // Resets timer and its display
    clearInterval(timer);
    $('.display-time')[0].textContent = "";
    // Sets up the timer for the game
    timer = setTimer();
    // Responds to player's moves
    $(document).keydown(function(key) {
        if([37, 38, 39, 40].indexOf(key.keyCode) > -1) {
            key.preventDefault();
        }
        // If left key is pressed
        if(key.keyCode == 37) {
            let spawn = false;
            let spawnLoc = 0;
            for(let i = 0; i < 3; i++) {
                for(let j = 0 + i; j < 16; j += 4) {
                    let curTile = $('.puzzle-container')[j];
                    let neighTile =  $('.puzzle-container')[j + 1];
                    // Case one: if left container has no tile and right one has a tile
                    if(!isTile(curTile) && isTile(neighTile)) {    
                        removeAnimFrom(curTile); 
                        addAnim(curTile, 'slideInRight');
                        
                        cloneTile(curTile, neighTile);
                        spawn = true;
                        spawnLoc = j;
                        while(spawnLoc % 4 < 3) {
                            spawnLoc++;
                        }
                    // Case two: if both the left and right containers have tiles
                    } else if(isTile(curTile) && isTile(neighTile)) {
                        let curNum = +curTile.firstChild.textContent;
                        let neighNum = +neighTile.firstChild.textContent;
                        // If both tiles have numbers less than 3
                        if(curNum < 3 && neighNum < 3) {
                            // If both tiles add up to 3
                            if(curNum + neighNum == 3) {
                                curTile.classList.remove(getTileProp(curTile));
                                curTile.classList.add('threes');
                                curTile.firstChild.textContent = '3';
                                removeAnimFrom(curTile); 
                                addAnim(curTile, 'slideInRight');
                                emptyContain(neighTile);
                                spawn = true;
                                spawnLoc = j;
                                while(spawnLoc % 4 < 3) {
                                    spawnLoc++;
                                }
                            }
                        // If both tiles are greater than 3 and have the same number
                        } else if(curNum == neighNum) {
                            curTile.classList.remove(getTileProp(curTile));
                            curTile.classList.add('aboveThrees');
                            curTile.firstChild.textContent = curNum * 2;
                            removeAnimFrom(curTile); 
                            addAnim(curTile, 'slideInRight');
                            emptyContain(neighTile);
                            spawn = true;
                            spawnLoc = j;
                            while(spawnLoc % 4 < 3) {
                                spawnLoc++;
                            }
                        }
                    }
                }
            }
            if(spawn) {
                spawnTile(spawnLoc, nextTileNum, 'slideInRight');
                nextTileNum = Math.floor(Math.random() * 3);
                nextTile = attachSmallTile(nextTileNum);
                $('.next-puzzle')[0].removeChild($('.next-puzzle')[0].childNodes[3]);
                $('.next-puzzle')[0].append(nextTile);
            }
        }
        // If right key is pressed
        if(key.keyCode == 39) {
            let spawn = false;
            let spawnLoc = 0;
            for(let i = 0; i < 3; i++) {
                for(let j = 15 - i; j >= 0; j -= 4) {
                    let curTile = $('.puzzle-container')[j];
                    let neighTile =  $('.puzzle-container')[j - 1];
                    // Case one: if left container has no tile and right one has a tile
                    if(!isTile(curTile) && isTile(neighTile)) {
                        removeAnimFrom(curTile); 
                        addAnim(curTile, 'slideInLeft');
                        cloneTile(curTile, neighTile);
                        spawn = true;
                        spawnLoc = j;
                        while(spawnLoc % 4 > 0) {
                            spawnLoc--;
                        }
                    // Case two: if both the left and right containers have tiles
                    } else if(isTile(curTile) && isTile(neighTile)) {
                        let curNum = +curTile.firstChild.textContent;
                        let neighNum = +neighTile.firstChild.textContent;
                        // If both tiles have numbers less than 3
                        if(curNum < 3 && neighNum < 3) {
                            // If both tiles add up to 3
                            if(curNum + neighNum == 3) {
                                curTile.classList.remove(getTileProp(curTile));
                                curTile.classList.add('threes');
                                curTile.childNodes[0].textContent = '3';
                                removeAnimFrom(curTile); 
                                addAnim(curTile, 'slideInLeft');  
                                emptyContain(neighTile);
                                spawn = true;
                                spawnLoc = j;
                                while(spawnLoc % 4 > 0) {
                                    spawnLoc--;
                                }
                            }
                        // If both tiles are greater than 3 and have the same number
                        } else if(curNum == neighNum) {
                            curTile.classList.remove(getTileProp(curTile));
                            curTile.classList.add('aboveThrees');
                            curTile.firstChild.textContent = curNum * 2;
                            removeAnimFrom(curTile); 
                            addAnim(curTile, 'slideInLeft');
                            emptyContain(neighTile);
                            spawn = true;
                            spawnLoc = j;
                            while(spawnLoc % 4 > 0) {
                                spawnLoc--;
                            }
                        }
                    }
                }
            }
            if(spawn) {
                spawnTile(spawnLoc, nextTileNum, 'slideInLeft');
                nextTileNum = Math.floor(Math.random() * 3);
                nextTile = attachSmallTile(nextTileNum);
                $('.next-puzzle')[0].removeChild($('.next-puzzle')[0].childNodes[3]);
                $('.next-puzzle')[0].append(nextTile);
            }
        }
        // If up key is pressed
        if(key.keyCode == 38) {
            let spawn = false;
            let spawnLoc = 0;
            for(let i = 0; i < 3; i++) {
                for(let j = 4 * i; j <= (4 * i) + 3; j++) {
                    let curTile = $('.puzzle-container')[j];
                    let neighTile =  $('.puzzle-container')[j + 4];
                    // Case one: if left container has no tile and right one has a tile
                    if(!isTile(curTile) && isTile(neighTile)) {
                        removeAnimFrom(curTile); 
                        addAnim(curTile, 'slideInUp');
                        cloneTile(curTile, neighTile);
                        spawn = true;
                        spawnLoc = j;
                        while(spawnLoc < 12) {
                            spawnLoc += 4;
                        }
                    // Case two: if both the left and right containers have tiles
                    } else if(isTile(curTile) && isTile(neighTile)) {
                        let curNum = +curTile.firstChild.textContent;
                        let neighNum = +neighTile.firstChild.textContent;
                        // If both tiles have numbers less than 3
                        if(curNum < 3 && neighNum < 3) {
                            // If both tiles add up to 3
                            if(curNum + neighNum == 3) {
                                curTile.classList.remove(getTileProp(curTile));
                                curTile.classList.add('threes');
                                curTile.firstChild.textContent = '3';
                                removeAnimFrom(curTile); 
                                addAnim(curTile, 'slideInUp');
                                emptyContain(neighTile);
                                spawn = true;
                                spawnLoc = j;
                                while(spawnLoc < 12) {
                                    spawnLoc += 4;
                                }
                            }
                        // If both tiles are greater than 3 and have the same number
                        } else if(curNum == neighNum) {
                            curTile.classList.remove(getTileProp(curTile));
                            curTile.classList.add('aboveThrees');
                            curTile.firstChild.textContent = curNum * 2;
                            removeAnimFrom(curTile); 
                            addAnim(curTile, 'slideInUp');
                            emptyContain(neighTile);
                            spawn = true;
                            spawnLoc = j;
                            while(spawnLoc < 12) {
                                spawnLoc += 4;
                            }
                        }
                    }
                }
            }
            if(spawn) {
                spawnTile(spawnLoc, nextTileNum, 'slideInUp');
                nextTileNum = Math.floor(Math.random() * 3);
                nextTile = attachSmallTile(nextTileNum);
                $('.next-puzzle')[0].removeChild($('.next-puzzle')[0].childNodes[3]);
                $('.next-puzzle')[0].append(nextTile);
            }
        }
        // If down key is pressed
        if(key.keyCode == 40) {
            let spawn = false;
            let spawnLoc = 0;
            for(let i = 0; i < 3; i++) {
                for(let j = 15 - (4 * i); j >= 12 - (4 * i); j--) {
                    let curTile = $('.puzzle-container')[j];
                    let neighTile =  $('.puzzle-container')[j - 4];
                    // Case one: if left container has no tile and right one has a tile
                    if(!isTile(curTile) && isTile(neighTile)) {
                        removeAnimFrom(curTile); 
                        addAnim(curTile, 'slideInDown');
                        cloneTile(curTile, neighTile);
                        spawn = true;
                        spawnLoc = j;
                        while(spawnLoc > 3) {
                            spawnLoc -= 4;
                        }
                    // Case two: if both the left and right containers have tiles
                    } else if(isTile(curTile) && isTile(neighTile)) {
                        let curNum = +curTile.firstChild.textContent;
                        let neighNum = +neighTile.firstChild.textContent;
                        // If both tiles have numbers less than 3
                        if(curNum < 3 && neighNum < 3) {
                            // If both tiles add up to 3
                            if(curNum + neighNum == 3) {
                                curTile.classList.remove(getTileProp(curTile));
                                curTile.classList.add('threes');
                                curTile.childNodes[0].textContent = '3';
                                removeAnimFrom(curTile); 
                                addAnim(curTile, 'slideInDown');
                                emptyContain(neighTile);
                                spawn = true;
                                spawnLoc = j;
                                while(spawnLoc > 3) {
                                    spawnLoc -= 4;
                                }
                            }
                        // If both tiles are greater than 3 and have the same number
                        } else if(curNum == neighNum) {
                            curTile.classList.remove(getTileProp(curTile));
                            curTile.classList.add('aboveThrees');
                            curTile.firstChild.textContent = curNum * 2;
                            removeAnimFrom(curTile); 
                            addAnim(curTile, 'slideInDown');
                            emptyContain(neighTile);
                            spawn = true;
                            spawnLoc = j;
                            while(spawnLoc > 3) {
                                spawnLoc -= 4;
                            }
                        }
                    }
                }
            }
            if(spawn) {
                spawnTile(spawnLoc, nextTileNum, 'slideInDown');
                nextTileNum = Math.floor(Math.random() * 3);
                nextTile = attachSmallTile(nextTileNum);
                $('.next-puzzle')[0].removeChild($('.next-puzzle')[0].childNodes[3]);
                $('.next-puzzle')[0].append(nextTile);
            }
        }
        if(isGameOver()) {
            // Displays whether the player won
            if(getScore() > 100) {
                $('#outcome')[0].textContent = "Victory!";
            } else {
                $('#outcome')[0].textContent = "Defeat";
            }
            let scoreDisplay = $('#score')[0].textContent;
            // Displays score
            if(scoreDisplay == '') {
                $('#score')[0].textContent = getScore();
            }
            let timeDisplay = $('#time')[0].textContent;
            // Displays time spent
            if(timeDisplay == '') {
                $('#time')[0].textContent = $('.display-time')[0].textContent;
            }
            // Displays modal window 
            $('#myModal').modal('show');
            $(document).off('keydown');
            // If play-again is clicked
            $('#play-again').click(function() {
                $('#myModal').modal('hide');
                clearBoard();
                $('#score')[0].textContent = "";
                $('#time')[0].textContent = "";
                $('#start-game').on('click');
                $(document).off('keydown');
                $('#start-game')[0].classList.remove('disabled');
                $('#start-game')[0].classList.add('active');
                $('#start-game').click(buttonClick());
            })
            // If close is clicked, just stop timer
            clearInterval(timer);
        }
    });
}

$('#start-game').click(buttonClick);