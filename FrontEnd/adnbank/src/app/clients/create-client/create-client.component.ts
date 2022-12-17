import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/services/client.service';

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.css']
})
export class CreateClientComponent implements OnInit  {

  public client:any= {
    type_of_identification: null,
    identification_number: null,
    name: null,
    lastname: null,
    e_mail: null,
    born_date: null,
    creation_date_of_the_account: null,
    creation_user: null,
    last_modification_date: null,
    last_modification_user: null

  }
  
  constructor(private clientService:ClientService){ }

  ngOnInit(): void {
  }

  calculateDate(){
    let date = new Date();

    let day = `${(date.getDate())}`.padStart(2,'0');
    let month = `${(date.getMonth()+1)}`.padStart(2,'0');
    let year = date.getFullYear();
    let hour = `${(date.getHours())}`.padStart(2,'0');
    let minutes = `${(date.getMinutes())}`.padStart(2,'0');
    let seconds = `${(date.getSeconds())}`.padStart(2,'0');

    let currentDate:string=`${year}-${month}-${day}T${hour}:${minutes}:${seconds}`;
    
    return currentDate;
  }

  adultChecker():boolean{
    let born_date= new Date(this.client.born_date);
    let today= new Date();
    let difference=(today.getTime() - born_date.getTime())*(1/1000)*(1/60)*(1/60)*(1/24);
    let minimumAgeInDays= (18*365)+1;    

    if(difference>minimumAgeInDays){
      return true;
    }else{
      return false;
    }
  }

  correctlyCompletedForm():boolean{
    if((this.client.name == null || this.client.name.length < 2) ||
    (this.client.lastname == null || this.client.lastname.length < 2) ||
    (this.client.e_mail == null || this.client.e_mail.indexOf("@") == -1) ||
    (this.client.type_of_identification.length == 0 || this.client.type_of_identification == null) ||
    (this.client.identification_number.length == 0 || this.client.identification_number == null) ||
    (this.client.born_date.length == 0 || this.client.born_date == null)
    ){
      return false;
    }else{
      return true;
    }
  }

  formSubmit(){
    console.log(this.client);    
    if(this.correctlyCompletedForm()){   
        if(this.adultChecker()){
          this.client.creation_user="Admin";
          this.client.creation_date_of_the_account=this.calculateDate();
          this.client.last_modification_user="Admin";
          this.client.last_modification_date=this.calculateDate();
                this.clientService.createClient(this.client).subscribe(
                (data) =>{
                  console.log(data);
                  alert('Cliente ingresado con exito.');
                  },(error)=>{
                  console.log(error);
                  alert('No se pudo ingresar el cliente');
                  }
              )
          } else{
            alert("no puedes crear una cuenta, eres menor de edad");      
            }
      }else{
        alert("ingresa el campo requerido:");       
        }
    }
}