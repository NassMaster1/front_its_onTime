import { Component } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import Chart from "chart.js/auto";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AirportService} from "../../services/airport/airport.service";

@Component({
  selector: 'app-airport',
  templateUrl: './airport.component.html',
  styleUrls: ['./airport.component.css']
})
export class AirportComponent {


  /*#########################################################################################
#################################   VARIABLES  ##############################################
############################################################################################ */
  closeResult!:string;
  errorMessage!:string
  AirPortForm!:FormGroup
  chart!:Chart
  codeAirPort!:Array<string>


  /*#########################################################################################
#############################################################################################
############################################################################################ */

  constructor( private fp: FormBuilder,private modalService: NgbModal,private AirPortService:AirportService) { }

  /*#########################################################################################
#################################   NG ON INIT ##############################################
############################################################################################ */
  // Ici on initialise le formulaire
  ngOnInit(): void {

    this.handelGetListCodeAirPort()


    this.AirPortForm=this.fp.group({
      codeAirPort: this.fp.control(null),
    })

  }

  /*#########################################################################################
#############################################################################################
############################################################################################ */

  /*#########################################################################################
#################################   GENERAL FUNCTION #########################################
############################################################################################ */

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }



  /*#########################################################################################
#############################################################################################
############################################################################################ */

  /*#########################################################################################
#################################   APPEL API  ##############################################
############################################################################################ */
  handelGetListCodeAirPort(){
    this.AirPortService.getListCodeAirPort().subscribe(
      {
        next:(data)=>{
          this.codeAirPort=data["airport_list"];
        },
        error :(err)=> {
          this.errorMessage="une erreur serveur s'est produite";
        }
      });
  }




  async handleGetDetailAirPort() : Promise<any>{
    let paramGraph=this.AirPortForm.value;
    let data = await this.AirPortService.getAirPortDetail(paramGraph["codeAirPort"]).toPromise();
    return data;
  }


  /*#########################################################################################
#############################################################################################
############################################################################################ */

  /*#########################################################################################
#############################   GRAPH FUNCTION AND CONFIGURATION ############################
############################################################################################ */
  //pour ouvrir la fenetre du formulaire
  opensm(content: any) {

    this.modalService.open(content,{size:'sm',centered: true,backdrop: 'static'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  openlg(content:any){
    this.modalService.open(content, {size: 'lg', centered: true, backdrop: 'static'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  async openGraphMeanDelayAirPort(content: any) {
    //étape 1
    let data = await this.handleGetDetailAirPort();
    //étape 2
    this.openlg(content)
    //étape 3
    let text="Retards sur l'aéroport "+this.AirPortForm.value["codeAirPort"] + " pour les 5 dernières années"
    this.createCharAirPortDelayMean(data["mean_delay"],text)
  }



  async  openCancelledbyyAirPort(content: any) {
    //étape 1
    let data = await this.handleGetDetailAirPort();
    //étape 2
    this.openlg(content)
    //étape 3
    let text="nombre de vols annulés et retardés  "+this.AirPortForm.value["codeAirPort"] + " pour les 5 dernières années"
    this.createCharAirPortCancelled(data["count_cancelled"],data["count_delayed"],data["count_total"],text)
  }


  //Fonction pour créer le graph chart.js en param: le data
  createCharAirPortDelayMean(data:any,text:string) {
    this.chart = new Chart("chart1", {
      // @ts-ignore
      type:"bar",
      data: {
        labels: ['Janvier', 'Février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre'],
        datasets: [{
          label: text,
          data: data,
          borderWidth: 2
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }


  //Fonction pour créer le graph chart.js en param: le data
  createCharAirPortCancelled(data1:any,data2:any,data3:any,text:string) {
    this.chart = new Chart("chart1", {
      // @ts-ignore
      type:"bar",
      data: {
        labels: ['Janvier', 'Février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre'],
        datasets: [{
          label: "Total des vols",
          data: data3,
          borderWidth: 2
        },{
          label: "vols retardés",
          data: data2,
          borderWidth: 2
        },{
          label: "vols annulés",
          data: data1,
          borderWidth: 2
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Chart.js Bar Chart - Stacked'
          },
        },
        responsive: true,
        interaction: {
          intersect: false,
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true
          }
        }
      }
    });
  }

  /*#########################################################################################
#############################################################################################
############################################################################################ */


}
