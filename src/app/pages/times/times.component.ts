import {Component, OnInit} from '@angular/core';
import Chart from 'chart.js/auto';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup} from "@angular/forms";
import {TimeService} from "../../services/times/time.service";
// @ts-ignore
import Plotly from 'plotly.js-dist'

@Component({
  selector: 'app-companies',
  templateUrl: './times.component.html',
  styleUrls: ['./times.component.css']
})
export class TimesComponent implements OnInit{

  /*#########################################################################################
#################################   VARIABLES  ##############################################
############################################################################################ */
  closeResult!:string;
  errorMessage!:string
  TimeForm!:FormGroup
  HourForm!:FormGroup
  CityForm!:FormGroup
  chart!:Chart
  years!:Array<number>
  codeCompanies!:Array<string>
  listState!:Array<string>
  listCity!:Array<string>
  options!:Array<string>

  /*#########################################################################################
#############################################################################################
############################################################################################ */

  constructor( private fp: FormBuilder,private modalService: NgbModal,private timeService:TimeService) { }

  /*#########################################################################################
#################################   NG ON INIT ##############################################
############################################################################################ */
  // Ici on initialise le formulaire
  ngOnInit(): void {
    this.inializeOptions()
    this.inializeyears()
    this.handelGetListCodeCompanies()
    this.handelGetListStates()
    this.handelGetListcity()

    this.TimeForm=this.fp.group({
      option: this.fp.control(null),
      year: this.fp.control(null),
      typeGraph:this.fp.control(null)
    })

    this.HourForm=this.fp.group({
      year: this.fp.control(null),
      typeGraph:this.fp.control(null)

    })

    this.CityForm=this.fp.group({
      codeCityOrigin: this.fp.control(null),
      codeCityDest:this.fp.control(null),
      year: this.fp.control(null),
      typeGraph:this.fp.control(null)

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

  private inializeyears(){
    const years: number[] = [];

    for (let i = 2004; i <= 2020; i++) {
      years.push(i);
    }
    this.years=years
  }

  private inializeOptions(){
    const options: string[] = [];
    options.push("DayOfMonth");
    options.push("DayOfWeek");
    options.push("Quarter");
    options.push("Month");
    this.options=options
  }

  /*#########################################################################################
#############################################################################################
############################################################################################ */

  /*#########################################################################################
#################################   APPEL API  ##############################################
############################################################################################ */
  handelGetListCodeCompanies(){
    this.timeService.getListCodeCompanies().subscribe(
      {
        next:(data)=>{
          this.codeCompanies=data;
        },
        error :(err)=> {
          this.errorMessage="une erreur serveur s'est produite";
        }
      });
  }

  handelGetListStates(){
    this.timeService.getListStates().subscribe(
      {
        next:(data)=>{
          this.listState=data;
        },
        error :(err)=> {
          this.errorMessage="une erreur serveur s'est produite";
        }
      });
  }

  handelGetListcity(){
    this.timeService.getListCity().subscribe(
      {
        next:(data)=>{
          this.listCity=data;
        },
        error :(err)=> {
          this.errorMessage="une erreur serveur s'est produite";
        }
      });
  }

  async handleMeanDelayByTime() : Promise<any>{
    let paramGraph=this.TimeForm.value;
    let data = await this.timeService.meanDelayByTime(paramGraph["option"],paramGraph["year"]).toPromise();
    return data;
  }

  async handleMeanDelayByHour() : Promise<any>{
    let paramGraph=this.HourForm.value;
    let data = await this.timeService.meanDelayByHour(paramGraph["year"]).toPromise();
    return data;
  }

  async handleMeanDelayDayMonth() : Promise<any>{
    let paramGraph=this.TimeForm.value;
    let data = await this.timeService.meanDelayDayMonth(paramGraph["year"]).toPromise();
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

  //étape 1- La fonction pour appeller notre fonction de l'api
  //étape 2- Appeler la fonction openlg pour ouvrir la fenetre ou afficher le graph
  //étape 33-Appeler la fonction "createChartMeanDelayCompanie" pour creer le graph Chart.myScripts.js en param: nos données récuperer depuis la fonction "handleMeanDelayCompanies"
  async openGraphMeanDelayHour(content: any) {
    //étape 1
    let data = await this.handleMeanDelayByHour();
    //étape 2
    this.openlg(content)
    //étape 3
    let text="Retard des avions par heure pour l\'anée: "+this.HourForm.value["year"]
    this.createChartHour(data["count_delayed"],text,this.HourForm.value["typeGraph"])
  }

  async  openMeanDelayByTime(content: any) {
    //étape 1
    let data = await this.handleMeanDelayByTime();
    //étape 2
    this.openlg(content)
    //étape 3
    let text="Retard moyen pour la période du "+this.TimeForm.value["option"] + " pour l\'anée: "+this.TimeForm.value["year"]
    if(this.TimeForm.value["option"] == "Month") {
      this.createChartMonth(data["count_delayed"], text, this.TimeForm.value["typeGraph"])
    }
    if(this.TimeForm.value["option"] == "DayOfMonth") {
      this.createChartDayOfMonth(data["count_delayed"], text, this.TimeForm.value["typeGraph"])
    }
    if(this.TimeForm.value["option"] == "DayOfWeek") {
      this.createChartDayOfWeek(data["count_delayed"], text, this.TimeForm.value["typeGraph"])
    }
    if(this.TimeForm.value["option"] == "Quarter") {
      this.createChartQuarter(data["count_delayed"], text, this.TimeForm.value["typeGraph"])
    }
  }

  async  openHeatmapDayMonth(content: any) {
    //étape 1
    let data = await this.handleMeanDelayByHour();
    //étape 2
    this.openlg(content)
    //étape 3
    let text="Les retards selon l'état "+this.HourForm.value["codeStateOrigin"]+ " à destination de " +this.HourForm.value["codeStateDest"]  + " pour l\'année: "+this.HourForm.value["year"]
    this.createHeatMap(data["count_delayed"],text)
  }

  //Fonction pour créer le graph chart.myScripts.js en param: le data
  createChartHour(data:any,text:string,typeGraph:string) {
    this.chart = new Chart("chart1", {
      // @ts-ignore
      type:typeGraph,
      data: {
        labels: ['0h-2h','2h-4h','6h-8h','10h-12h','12h-14h','14h-16h','16h-18h','18h-20h','20h-22h','22h-24h'],
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

  createChartMonth(data:any,text:string,typeGraph:string) {
    this.chart = new Chart("chart1", {
      // @ts-ignore
      type:typeGraph,
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

  createChartQuarter(data:any,text:string,typeGraph:string) {
    this.chart = new Chart("chart1", {
      // @ts-ignore
      type:typeGraph,
      data: {
        labels: ['Printemps','Ete','Automne','Hiver'],
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

  createChartDayOfWeek(data:any,text:string,typeGraph:string) {
    this.chart = new Chart("chart1", {
      // @ts-ignore
      type:typeGraph,
      data: {
        labels: ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'],
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


  createChartDayOfMonth(data:any,text:string,typeGraph:string) {
    this.chart = new Chart("chart1", {
      // @ts-ignore
      type:typeGraph,
      data: {
        labels: ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'],
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

  createHeatMap(data:any,text:string){
    const xValues=['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'];
    const yValues=['1','2','3','4','5','6','7','8','9','10','11','12'];
    const zValues=[
      [1.00, 0.9, 0.75, 0.75, 0.8],
      [0.5, 0.5, 0.75, 0.75, 0.6],
      [0.75, 0.75, 0.75, 0.75, 0.75],
      [0.3, 0.4, 0.3, 0.75, 0.2]];
    data=[{
      x:xValues,
      y:yValues,
      z:zValues,
      type:'heatmap',
      colorscale:'YlGnBu',
    }];
    Plotly.newPlot('myDiv',data,{},{responsive:true});
  }

  /*#########################################################################################
#############################################################################################
############################################################################################ */



}


