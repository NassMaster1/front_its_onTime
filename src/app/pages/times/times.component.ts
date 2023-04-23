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
  StatesForm!:FormGroup
  chart!:Chart
  years!:Array<number>
  codeCompanies!:Array<string>
  listState!:Array<string>
  listCity!:Array<string>
  options!:Array<string>
  hours!:Array<string>

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
    this.inializeHourDelay()

    this.TimeForm=this.fp.group({
      option: this.fp.control(null),
      codeStateOrigin: this.fp.control(null),
      codeStateDest:this.fp.control(null)
    })

    this.HourForm=this.fp.group({
      codeStateOrigin: this.fp.control(null),
      codeStateDest:this.fp.control(null),
      hour:this.fp.control(null)

    })

    this.StatesForm=this.fp.group({
      codeStateOrigin: this.fp.control(null),
      codeStateDest:this.fp.control(null),
      option1: this.fp.control(null),
      option2:this.fp.control(null)

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
    options.push("DayOfWeek");
    options.push("Quarter");
    options.push("Month");
    this.options=options
  }

  private inializeHourDelay(){
    const options: string[] = [];
    options.push("2h");
    options.push("4h");
    options.push("6h");
    this.hours=options
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
    let data = await this.timeService.meanDelayByTime(paramGraph["option"],paramGraph["codeStateOrigin"],paramGraph["codeStateDest"]).toPromise();
    return data;
  }

  async handleMeanDelayByHour() : Promise<any>{
    let paramGraph=this.HourForm.value;
    let data = await this.timeService.meanDelayByHour(paramGraph["codeStateOrigin"],paramGraph["codeStateDest"],paramGraph["hour"]).toPromise();
    return data;
  }

  async handleMeanDelayDayMonth() : Promise<any>{
    let paramGraph=this.StatesForm.value;
    let data = await this.timeService.meanDelayDayMonth(paramGraph["option1"],paramGraph["option2"],paramGraph["codeStateOrigin"],paramGraph["codeStateDest"]).toPromise();
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
    let text="Retard des avions par heure";
    this.createChartHour(data["count_delayed"],data["max_delayed"],data["min_delayed"],text,data["hour"])
  }

  async  openMeanDelayByTime(content: any) {
    //étape 1
    let data = await this.handleMeanDelayByTime();
    //étape 2
    this.openlg(content)
    //étape 3
    let text="Retard moyen pour la période du "+this.TimeForm.value["option"]
    if(this.TimeForm.value["option"] == "Month") {
      this.createChartMonth(data["mean_delay"],data["highest_delay"],data["lowest_delay"], text)
    }
    if(this.TimeForm.value["option"] == "DayofMonth") {
      this.createChartDayOfMonth(data["mean_delay"],data["highest_delay"],data["lowest_delay"], text)
    }
    if(this.TimeForm.value["option"] == "DayOfWeek") {
      this.createChartDayOfWeek(data["mean_delay"],data["highest_delay"],data["lowest_delay"], text)
    }
    if(this.TimeForm.value["option"] == "Quarter") {
      this.createChartQuarter(data["mean_delay"],data["highest_delay"],data["lowest_delay"], text)
    }
  }

  async  openHeatmapDayMonth(content: any) {
    //étape 1
    let data = await this.handleMeanDelayDayMonth();
    //étape 2
    this.openlg(content)
    //étape 3
    let text="Les retards selon l'état "+this.StatesForm.value["codeStateOrigin"]+ " à destination de " +this.StatesForm.value["codeStateDest"]  + " pour l\'année: "+this.StatesForm.value["year"]
    console.log(data);
    this.createHeatMap(data[this.StatesForm.value["option1"]],data[this.StatesForm.value["option2"]], data["result"],text,this.StatesForm.value["option1"],this.StatesForm.value["option2"])
  }

  //Fonction pour créer le graph chart.myScripts.js en param: le data
  createChartHour(average:any,highest: any, lowest: any, text:string, label: any) {
    this.chart = new Chart("chart1", {
      // @ts-ignore
      type:"bar",
      data: {
        labels: label,
        datasets: [{
          label: "Highest delay",
          data: highest,
          borderWidth: 2
        }, {
          label: "Average delay",
          data: average,
          borderWidth: 2
        }, {
          label: "Lowest delay",
          data: lowest,
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

  createChartMonth(average:any, highest: any, lowest: any,text:string) {
    this.chart = new Chart("chart1", {
      // @ts-ignore
      type:"bar",
      data: {
        labels: ['Janvier', 'Février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre'],
        datasets: [{
          label: "Highest delay",
          data: highest,
          borderWidth: 2
        }, {
          label: "Average delay",
          data: average,
          borderWidth: 2
        }, {
          label: "Lowest delay",
          data: lowest,
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

  createChartQuarter(average:any, highest: any, lowest: any,text:string) {
    this.chart = new Chart("chart1", {
      // @ts-ignore
      type:"bar",
      data: {
        labels: ['Printemps','Ete','Automne','Hiver'],
        datasets: [{
          label: "Highest delay",
          data: highest,
          borderWidth: 2
        }, {
          label: "Average delay",
          data: average,
          borderWidth: 2
        }, {
          label: "Lowest delay",
          data: lowest,
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

  createChartDayOfWeek(average:any, highest: any, lowest: any,text:string) {
    this.chart = new Chart("chart1", {
      // @ts-ignore
      type:"bar",
      data: {
        labels: ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'],
        datasets: [{
          label: "Highest delay",
          data: highest,
          borderWidth: 2
        }, {
          label: "Average delay",
          data: average,
          borderWidth: 2
        }, {
          label: "Lowest delay",
          data: lowest,
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


  createChartDayOfMonth(average:any, highest: any, lowest: any,text:string) {
    this.chart = new Chart("chart1", {
      // @ts-ignore
      type:"bar",
      data: {
        labels: ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'],
        datasets: [{
          label: "Highest delay",
          data: highest,
          borderWidth: 2
        }, {
          label: "Average delay",
          data: average,
          borderWidth: 2
        }, {
          label: "Lowest delay",
          data: lowest,
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

  createHeatMap(labelX:any,labelY:any,value:any,text:string, option1: any, option2:any){
    let colorscaleValue = [
      [0, '#EEEEEE'],
      [1, '#000088']
    ];

    const shiftedLabelX = labelX.map((x: number) => x - 0.5);

    let data = [{
      x: shiftedLabelX,
      y: labelY,
      z: value,
      type: 'heatmap',
      xgap: 1,
      ygap: 1,
      colorscale: colorscaleValue,
    }];
    if(option2 == "DayOfWeek"){
      let layout = {
        xaxis: {
          tickvals: [1, 2, 3, 4, 5, 6,7], // set the tick values to 0-indexed values
          ticktext: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], // set the tick labels
        }
      };

      Plotly.newPlot('myDiv', data, layout, {responsive:false});
    }

    else if(option1 == "DayOfWeek"){
      let layout = {
        yaxis: {
          tickvals: [1, 2, 3, 4, 5, 6,7], // set the tick values to 0-indexed values
          ticktext: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], // set the tick labels
        }
      };

      Plotly.newPlot('myDiv', data, layout, {responsive:false});
    }

    else{
      Plotly.newPlot('myDiv', data, {}, {responsive:false});
    }

  }

  /*#########################################################################################
#############################################################################################
############################################################################################ */



}


