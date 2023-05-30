import { Component } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CompanieService} from "../../services/companies/companie.service";
import {AirportService} from "../../services/airport/airport.service";
import {PredictionService} from "../../services/prediction/prediction.service";


@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.css']
})
export class PredictionComponent {




  /*#########################################################################################
#################################   VARIABLES  ##############################################
############################################################################################ */
  closeResult!:string;
  errorMessage!:string
  predictForm!:FormGroup
  codeCompanies!:Array<string>
  listAirPort!:Array<string>

  onTime!:number
  late!:number
  latePlus!:number


  /*#########################################################################################
  #############################################################################################
  ############################################################################################ */

  constructor( private fp: FormBuilder,private modalService: NgbModal, private companieService:CompanieService,private AirPortService:AirportService,private predictionService:PredictionService) { }

  // Ici on initialise le formulaire
  ngOnInit(): void {

    this.handelGetListCodeAirPort()
    this.handelGetListCodeCompanies()

    this.predictForm=this.fp.group({
      codeCompanie: this.fp.control(null),
      codeOrigin: this.fp.control(null),
      codeDest: this.fp.control(null),
      date: this.fp.control(null)
    })

  }


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  handelGetListCodeCompanies(){
    this.companieService.getListCodeCompanies().subscribe(
      {
        next:(data)=>{
          this.codeCompanies=data;
        },
        error :(err)=> {
          this.errorMessage="une erreur serveur s'est produite";
        }
      });
  }

  handelGetListCodeAirPort(){
    this.AirPortService.getListCodeAirPort().subscribe(
      {
        next:(data)=>{
          this.listAirPort=data["airport_list"];
        },
        error :(err)=> {
          this.errorMessage="une erreur serveur s'est produite";
        }
      });
  }

  //pour ouvrir la fenetre du formulaire
  opensm(content: any) {

    this.modalService.open(content,{size:'sm',centered: true,backdrop: 'static'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  async openPredection() {
    let paramGraph = this.predictForm.value;
    let selectedDate: Date = paramGraph["date"];


    if (selectedDate) {
      let weekday = selectedDate.getDay();
      if (weekday == 0) {
        weekday = 7
      }
      let day = selectedDate.getDate();
      let month = selectedDate.getMonth() + 1;
      let year = selectedDate.getFullYear();


      let data = {
        "Month": month.toString(),
        "DayofMonth": day.toString(),
        "DayOfWeek": weekday.toString(),
        "Reporting_Airline": paramGraph["codeCompanie"],
        "Origin": paramGraph["codeOrigin"],
        "Dest": paramGraph["codeDest"]
      };

      let result = await this.predictionService.predictionFlight(data).toPromise();

      this.onTime=result["onTime"]
      this.late=result["late"]
      this.latePlus=result["latePlus"]

    }
  }
}
