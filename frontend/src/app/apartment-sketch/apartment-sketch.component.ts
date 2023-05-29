import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-apartment-sketch',
  templateUrl: './apartment-sketch.component.html',
  styleUrls: ['./apartment-sketch.component.css']
})
export class ApartmentSketchComponent implements OnInit {

  static basta;
	static bastaC;
		
	static collisionDetected = false; // jako bitno
	
	static stoVisina = 150;
	static stoSirina = 400;
	static stoX = 0;
	static stoY = 0;
	static misX = 0;
	static misY = 0;
	static move = false;
	static invalid = false

	// simulacija drugog pravougaonog stola
	static sto2Visina = 150;
	static sto2Sirina = 250;
	static sto2X = 500;
	static sto2Y = 300;
	static move2 = false;
	static invalid2 = false;

  constructor() { }

  ngOnInit(): void {
    ApartmentSketchComponent.basta = document.querySelector("#apartmentCanvas");
    ApartmentSketchComponent.bastaC = ApartmentSketchComponent.basta.getContext("2d");

    ApartmentSketchComponent.basta.height = "700";
    ApartmentSketchComponent.basta.style.height = "700px";
	  ApartmentSketchComponent.basta.width = "800";
    ApartmentSketchComponent.basta.style.width = "800px";
    ApartmentSketchComponent.drawAllTables();

    ApartmentSketchComponent.basta.addEventListener("mousedown", ApartmentSketchComponent.startPosition);
    ApartmentSketchComponent.basta.addEventListener("mousemove", ApartmentSketchComponent.moveTable);
    ApartmentSketchComponent.basta.addEventListener("mouseup",   ApartmentSketchComponent.endPosition);
    ApartmentSketchComponent.basta.addEventListener("mouseout",  ApartmentSketchComponent.endPosition);
    }

  static drawAllTables()
	{ // ovo ce biti neki niz
		if(!ApartmentSketchComponent.move) 
		{
			if(ApartmentSketchComponent.invalid) 
			{
				ApartmentSketchComponent.bastaC.fillStyle = 'red';
				ApartmentSketchComponent.bastaC.fillRect(ApartmentSketchComponent.stoX, ApartmentSketchComponent.stoY, ApartmentSketchComponent.stoSirina, ApartmentSketchComponent.stoVisina);
				ApartmentSketchComponent.bastaC.fillStyle = 'black';
			}
			else
      ApartmentSketchComponent.bastaC.fillRect(ApartmentSketchComponent.stoX, ApartmentSketchComponent.stoY, ApartmentSketchComponent.stoSirina, ApartmentSketchComponent.stoVisina);
			
		}
		if(!ApartmentSketchComponent.move2) 
		{ 
			if(ApartmentSketchComponent.invalid2) 
			{
				ApartmentSketchComponent.bastaC.fillStyle = 'red';
				ApartmentSketchComponent.bastaC.fillRect(ApartmentSketchComponent.sto2X, ApartmentSketchComponent.sto2Y, ApartmentSketchComponent.sto2Sirina, ApartmentSketchComponent.sto2Visina);
				ApartmentSketchComponent.bastaC.fillStyle = 'black';
			}
			else
      ApartmentSketchComponent.bastaC.fillRect(ApartmentSketchComponent.sto2X, ApartmentSketchComponent.sto2Y, ApartmentSketchComponent.sto2Sirina, ApartmentSketchComponent.sto2Visina);
		}
		
	}
	
	static startPosition(e)
	{
		ApartmentSketchComponent.misX = e.clientX;
		ApartmentSketchComponent.misY = e.clientY;
		ApartmentSketchComponent.move = true;
	}
	
	static moveTable(e)
	{
		if(!ApartmentSketchComponent.move) return;

    console.log(e.clientX);

		ApartmentSketchComponent.bastaC.clearRect(ApartmentSketchComponent.stoX, ApartmentSketchComponent.stoY, ApartmentSketchComponent.stoSirina, ApartmentSketchComponent.stoVisina);
		ApartmentSketchComponent.drawAllTables();

		var errorX = false, errorY = false;
		
		// check and correct moving off the canvas
		if(ApartmentSketchComponent.stoX + (e.clientX - ApartmentSketchComponent.misX) < 0)
		{
			ApartmentSketchComponent.stoX = 0;
			errorX = true;
		}
		if(ApartmentSketchComponent.stoX + (e.clientX - ApartmentSketchComponent.misX) + ApartmentSketchComponent.stoSirina > ApartmentSketchComponent.basta.width)
		{
			ApartmentSketchComponent.stoX = ApartmentSketchComponent.basta.width - ApartmentSketchComponent.stoSirina;
			errorX = true;
		}
		if(ApartmentSketchComponent.stoY + (e.clientY - ApartmentSketchComponent.misY) < 0)
		{
			ApartmentSketchComponent.stoY = 0;
			errorY = true;
		}
		if(ApartmentSketchComponent.stoY + (e.clientY - ApartmentSketchComponent.misY) + ApartmentSketchComponent.stoVisina > ApartmentSketchComponent.basta.height)
		{
			ApartmentSketchComponent.stoY = ApartmentSketchComponent.basta.height - ApartmentSketchComponent.stoVisina;
			errorY = true;
		}
		
		
		
		if(!errorX) ApartmentSketchComponent.stoX = ApartmentSketchComponent.stoX + (e.clientX - ApartmentSketchComponent.misX);
		if(!errorY) ApartmentSketchComponent.stoY = ApartmentSketchComponent.stoY + (e.clientY - ApartmentSketchComponent.misY);
		
		// detect collision with other tables (this would be some forech through some array)
		if(((ApartmentSketchComponent.stoY >= ApartmentSketchComponent.sto2Y && ApartmentSketchComponent.stoY <= ApartmentSketchComponent.sto2Y + ApartmentSketchComponent.sto2Visina) || (ApartmentSketchComponent.stoY <= ApartmentSketchComponent.sto2Y && ApartmentSketchComponent.stoY + ApartmentSketchComponent.stoVisina >= ApartmentSketchComponent.sto2Y)) && 
		   ((ApartmentSketchComponent.stoX <= ApartmentSketchComponent.sto2X && ApartmentSketchComponent.stoX + ApartmentSketchComponent.stoSirina >= ApartmentSketchComponent.sto2X)  || (ApartmentSketchComponent.stoX >= ApartmentSketchComponent.sto2X && ApartmentSketchComponent.stoX <= ApartmentSketchComponent.sto2X + ApartmentSketchComponent.sto2Sirina))) 
       ApartmentSketchComponent.collisionDetected = true;
		else
    ApartmentSketchComponent.collisionDetected = false;
		
		if(ApartmentSketchComponent.collisionDetected) ApartmentSketchComponent.bastaC.fillStyle = 'red';
		else ApartmentSketchComponent.bastaC.fillStyle = 'green';
		ApartmentSketchComponent.bastaC.fillRect(ApartmentSketchComponent.stoX, ApartmentSketchComponent.stoY, ApartmentSketchComponent.stoSirina, ApartmentSketchComponent.stoVisina);
		ApartmentSketchComponent.bastaC.fillStyle = 'black';
		ApartmentSketchComponent.misX = e.clientX;
		ApartmentSketchComponent.misY = e.clientY;
	}
	
	static endPosition()
	{ // ovo se takodje treba generalizovati
		if(ApartmentSketchComponent.collisionDetected) ApartmentSketchComponent.invalid = true;
		else ApartmentSketchComponent.invalid = false;
		ApartmentSketchComponent.move = false;
		ApartmentSketchComponent.drawAllTables();
	}

}
