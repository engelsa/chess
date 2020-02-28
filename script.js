//SPECIFY COLORS FOR GETMOVES FUNCTION

var gameBoard=	[["wr0","wn","wb","wq","wk0","wb","wn","wr0"],
		["wp","wp","wp","wp","wp","wp","wp","wp"],
		[" "," "," "," "," "," "," "," "],
		[" "," "," "," "," "," "," "," "],
		[" "," "," "," "," "," "," "," "],
		[" "," "," "," "," "," "," "," "],
		["bp","bp","bp","bp","bp","bp","bp","bp"],
		["br0","bn","bb","bq","bk0","bb","bn","br0"]];

var isWhiteTurn=false;
var boardDisplay=[];
var playerMoves=[];

var playerFrom=[-1,-1];
var playerTo=[-1,-1];

function displayBoard(board,displayMove,move) {
	for (var row=0;row<boardDisplay.length;row++) {
		for (var column=0;column<boardDisplay[row].length;column++) {
			var color=board[row][column].substring(0,1);
			var piece=board[row][column].substring(1,2);
			if (color=="w") {
				boardDisplay[row][column].style.color="#000000";
			} else {
				boardDisplay[row][column].style.color="#FFFFFF";
			}
			boardDisplay[row][column].innerHTML=piece.toUpperCase();
			if ((row+column)/2!=Math.floor((row+column)/2)) {
				boardDisplay[row][column].style.background="#888888";
			} else {
				boardDisplay[row][column].style.background="#CCCCCC";
			}
			if (displayMove) {
				if (move.from[0]==row && move.from[1]==column) {
					boardDisplay[row][column].style.background="#DD3333";
				} else if (move.to[0]==row && move.to[1]==column) {
					boardDisplay[row][column].style.background="#33DD33";
				}
			}
		}
	}
}

function makeMove(currentBoard,move) {

	var board=[];
	var to=move.to;
	var from=move.from;

	for (var row=0;row<currentBoard.length;row++) {
		var rowArray=[];
		for (var column=0;column<currentBoard[row].length;column++) {
			rowArray[column]=currentBoard[row][column];
		}
		board.push(rowArray);
	}

	var space=board[from[0]][from[1]].substring(0,2);

	board[to[0]][to[1]]=space;
	board[from[0]][from[1]]=" ";

	if (space.substring(1,2)=="k" && from[1]==4 && from[0]==to[0] && (to[1]==2 || to[1]==6)) {
		if (to[1]==2) {
			board[to[0]][3]=board[to[0]][0];
			board[move.to[0]][0]=" ";
		} else {
			board[to[0]][5]=board[to[0]][7];
			board[to[0]][7]=" ";
		}
	} else if (space.substring(1,2)=="p" && (to[0]==0 || to[0]==7)) {
		var newPiece=" ";
		if (move.pref==0) {
			newPiece="n";
		} else if (move.pref==1) {
			newPiece="b";
		} else if (move.pref==2) {
			newPiece="r";
		} else {
			newPiece="q";
		}
		board[to[0]][to[1]]=space.substring(0,1)+newPiece;
	}

	return board;
}

function getPoints(board,isWhite,checkPlayer,isInCheck) {
	var points=0;
	if (isInCheck) {
		if (checkPlayer==isWhite) {
			return -100;
		} else {
			return 100;
		}
	}
	for (var row=0;row<board.length;row++) {
		for (var column=0;column<board[row].length;column++) {
			var pieceColor=board[row][column].substring(0,1)=="w";
			if (board[row][column]!=" ") {
				var piece=board[row][column].substring(1,2);
				if (isWhite==pieceColor) {
					if (piece=="p") {
						points++;
					} else if (piece=="n" || piece=="b") {
						points+=3;
					} else if (piece=="r") {
						points+=5;
					} else if (piece=="q") {
						points+=9;
					} else {
						points+=4;
					}
				} else {
					if (piece=="p") {
						points--;
					} else if (piece=="n" || piece=="b") {
						points-=3;
					} else if (piece=="r") {
						points-=5;
					} else if (piece=="q") {
						points-=9;
					} else {
						points-=4;
					}
				}
			}
		}
	}
	return points;
}

function getClearMoves(board,position,directions,limit,isPawn) {
	var moves=[];
	for (var x=0;x<directions.length;x++) {
		var direction=directions[x];
		for (var index=1;index<=limit;index++) {
			var posX=position[0]+direction[0]*index;
			var posY=position[1]+direction[1]*index;
			if (board[posX] && board[posX][posY]) {
				if (board[posX][posY].substring(0,1)==board[position[0]][position[1]].substring(0,1)) {
					break;
				} else {
					if (board[posX][posY]==" " || !isPawn) {
						var move={};
						move.from=[position[0],position[1]];
						move.to=[posX,posY];
						moves.push(move);
						//REVISE TO ACCOUNT FOR PAWNS
						if (board[posX][posY]!=" ") {
							break;
						}
					} else {
						break;
					}
				}
			} else {
				break;
			}
		}
	}
	return moves;
}

function getPieceMoves(board,position,isWhite,piece,checkMoves) {
	if (piece=="p") {
		var moves=[];
		if (isWhite) {
			var directions=[[1,0]];
			var availableMoves;
			if (position[0]==1) {
				availableMoves=getClearMoves(board,position,directions,2,true);
			} else {
				availableMoves=getClearMoves(board,position,directions,1,true);
			}
			moves=moves.concat(availableMoves);
			if (board[position[0]+1] && board[position[0]+1][position[1]+1] && board[position[0]+1][position[1]+1].substring(0,1)=="b") {
				var move={};
				move.from=[position[0],position[1]];
				move.to=[position[0]+1,position[1]+1];
				moves.push(move);
			}
			if (board[position[0]+1] && board[position[0]+1][position[1]-1] && board[position[0]+1][position[1]-1].substring(0,1)=="b") {
				var move={};
				move.from=[position[0],position[1]];
				move.to=[position[0]+1,position[1]-1];
				moves.push(move);
			}
		} else {
			var directions=[[-1,0]];
			var availableMoves;
			if (position[0]==6) {
				availableMoves=getClearMoves(board,position,directions,2,true);
			} else {
				availableMoves=getClearMoves(board,position,directions,1,true);
			}
			moves=moves.concat(availableMoves);
			if (board[position[0]-1] && board[position[0]-1][position[1]+1] && board[position[0]-1][position[1]+1].substring(0,1)=="w") {
				var move={};
				move.from=[position[0],position[1]];
				move.to=[position[0]-1,position[1]+1];
				moves.push(move);
			}
			if (board[position[0]-1] && board[position[0]-1][position[1]-1] && board[position[0]-1][position[1]-1].substring(0,1)=="w") {
				var move={};
				move.from=[position[0],position[1]];
				move.to=[position[0]-1,position[1]-1];
				moves.push(move);
			}
		}
		var length=moves.length;
		for (var index=0;index<length;index++) {
			if (moves[index].to[0]==0 || moves[index].to[0]==7) {
				for (var newPiece=0;newPiece<4;newPiece+=3) {
					var move={};
					move.from=moves[index].from;
					move.to=moves[index].to;
					move.pref=newPiece;
					moves.push(move);
				}
			}
		}
		return moves;
	} else if (piece=="n") {
		return getClearMoves(board,position,[[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]],1);
	} else if (piece=="r") {
		return getClearMoves(board,position,[[1,0],[0,1],[-1,0],[0,-1]],7);
	} else if (piece=="b") {
		return getClearMoves(board,position,[[1,1],[-1,1],[-1,-1],[1,-1]],7);
	} else if (piece=="q") {
		return getClearMoves(board,position,[[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]],7);
	} else {
		var availableMoves=getClearMoves(board,position,[[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]],1);
		if (board[position[0]][position[1]].length==3) {
			if (board[position[0]][0].length==3 && board[position[0]][1]==" " && board[position[0]][2]==" " && board[position[0]][3]==" ") {
				var move={};
				move.from=position;
				move.to=[position[0],2];
				move.castle=true;
				availableMoves.push(move);
			}
			if (board[position[0]][7].length==3 && board[position[0]][5]==" " && board[position[0]][6]==" ") {
				var move={};
				move.from=position;
				move.to=[position[0],6];
				move.castle=true;
				availableMoves.push(move);
			}
		}
		return availableMoves;
	}
}

function getMoves(board,isWhite,isRecursed) {
	var moves=[];
	var checkMoves=[];
	var isInCheck=false;
	for (var row=0;row<board.length;row++) {
		for (var column=0;column<board[row].length;column++) {
			var space=board[row][column];
			if (space!=" ") {
				var color=space.substring(0,1)=="w";
				var piece=space.substring(1,2);

				if (color==isWhite) {
					moves=moves.concat(getPieceMoves(board,[row,column],isWhite,piece));
				}
			}
		}
	}
	if (!isRecursed) {
		for (var index=0;index<moves.length;index++) {
			var hypoBoard=makeMove(board,moves[index]);
			var opponentMovement=getMoves(hypoBoard,!isWhite,true);
			var opponentMoves=opponentMovement[0];
			for (var hypoIndex=0;hypoIndex<opponentMoves.length;hypoIndex++) {
				var position=opponentMoves[hypoIndex].to
				var space=hypoBoard[position[0]][position[1]];
				var color=space.substring(0,1)=="w";
				var piece=space.substring(1,2);
				if (!isInCheck) {
					var currentSpace=board[position[0]][position[1]];
					var currentColor=currentSpace.substring(0,1)=="w";
					var currentPiece=currentSpace.substring(1,2);
					if (currentPiece=="k" && currentColor==isWhite) {
						isInCheck=true;
					}
				}
				if (piece=="k" && color==isWhite) {
					moves.splice(index,1);
					index--;
					break;
				}
			}
		}
	}
	if (isInCheck) {
		for (var index=0;index<moves.length;index++) {
			if (moves[index].castle) {
				moves.splice(index,1);
				index--;
			}
		}
	}
	return [moves,isInCheck];
}

function hypoPlay(moveTree,board,hypoIndex,isWhite,sourceIsWhite) {
	var extremeMove;
	var futureMoves=0;
	for (var index=0;index<moveTree.length;index++) {

		var move=moveTree[index];
		var hypoBoard=makeMove(board,move);
		var branchLength=0;
		if (hypoIndex<3) {
			var branchMovement=getMoves(hypoBoard,isWhite,false);
			var isInCheck=branchMovement[1];
			var branches=branchMovement[0];
			branchLength=branches.length;
			if (branches.length>0) {
				move.score=hypoPlay(branches,hypoBoard,hypoIndex+1,!isWhite,sourceIsWhite).score;
			} else {
				if (isWhite==sourceIsWhite) {
					if (isInCheck) {
						move.score=-100;
					} else {
						move.score=0;
					}
				} else {
					if (isInCheck) {
						move.score=100;
					} else {
						move.score=0;
					}
				}
			}
		} else {
			move.score=getPoints(hypoBoard,sourceIsWhite,isWhite,false);
		}
		if (!extremeMove) {
			extremeMove=move;
			futureMoves=branchLength;
		} else if (isWhite!=sourceIsWhite && move.score>extremeMove.score) {
			extremeMove=move;
			futureMoves=branchLength;
		} else if (isWhite==sourceIsWhite && move.score<extremeMove.score) {
			extremeMove=move;
			futureMoves=branchLength;
		} else if (move.score==extremeMove.score) {
			if (hypoIndex<3) {
				if (isWhite==sourceIsWhite) {
					if (branchLength<futureMoves) {
						extremeMove=move;
						futureMoves=branchLength;
					}
				} else {
					if (branchLength>futureMoves) {
						extremeMove=move;
						futureMoves=branchLength;
					}
				}
			} else if (Math.random()<.5) {
				extremeMove=move;
			}
		}
	}
	return extremeMove;
}


function makeHypoBoards(board,isWhite) {
	var moveStats=[];
	var movementTree=getMoves(board,isWhite,false);
	var moveTree=movementTree[0];

	move=hypoPlay(moveTree,board,0,!isWhite,isWhite);

	return [makeMove(board,move),move];
}

function getButton(x,y) {
	for (var row=0;row<boardDisplay.length;row++) {
		for (var column=0;column<boardDisplay[row].length;column++) {
			if (x<(row+1)*75 && y<(column+1)*75) {
				return boardDisplay[column][row];
			}
		}
	}
}

function makeEnemyMove() {
	var hypoResult=makeHypoBoards(gameBoard,isWhiteTurn)
	gameBoard=hypoResult[0];
	displayBoard(gameBoard,true,hypoResult[1]);
	isWhiteTurn=!isWhiteTurn;
	playerMoves=getMoves(gameBoard,isWhiteTurn,false)[0];
}

for (var row=0;row<gameBoard.length;row++) {
	boardDisplay[row]=[];
	for (var column=0;column<gameBoard[row].length;column++) {
		var button=document.createElement("button");
		button.boardPosition=[row,column];
		button.style.height="75px";
		button.style.width="75px";
		button.style.position="absolute";
		button.style.top=row*75+"px";
		button.style.left=column*75+"px";
		button.style.font="48px georgia";
		document.body.appendChild(button);
		boardDisplay[row].push(button);
	}
}

document.body.onmousedown=function(event) {
	var button=getButton(event.clientX,event.clientY);
	button.style.background="#DD3333";
	playerFrom=[button.boardPosition[0],button.boardPosition[1]];
}

document.body.onmouseup=function() {
	var button=getButton(event.clientX,event.clientY);
	playerTo=[button.boardPosition[0],button.boardPosition[1]];

	var isValid=false;
	var validMove;
	for (var index=0;index<playerMoves.length;index++) {
		if (playerMoves[index].from[0]==playerFrom[0] && playerMoves[index].from[1]==playerFrom[1] && playerMoves[index].to[0]==playerTo[0] && playerMoves[index].to[1]==playerTo[1]) {
			isValid=true;
			validMove=playerMoves[index];
			break;
		}
	}
	if (isValid) {
		gameBoard=makeMove(gameBoard,validMove);
		displayBoard(gameBoard,true,validMove);
		isWhiteTurn=!isWhiteTurn;
		setTimeout(makeEnemyMove,1);
	} else {
		displayBoard(gameBoard,false);
	}
}

displayBoard(gameBoard,false);
playerMoves=getMoves(gameBoard,isWhiteTurn,false)[0];