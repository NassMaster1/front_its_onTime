import {Component, OnInit, TemplateRef} from '@angular/core';
import Chart from 'chart.js/auto';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup} from "@angular/forms";
import {CauseDelayService} from  "../../services/causes/cause-delay.service";

@Component({
  selector: 'app-cause-delay',
  templateUrl: './cause-delay.component.html',
  styleUrls: ['./cause-delay.component.css']
})
export class CauseDelayComponent {


   /*#########################################################################################
#################################   VARIABLES  ##############################################
############################################################################################ */
closeResult!:string;
errorMessage!:string
CompanieForm!:FormGroup
StatesForm!:FormGroup
CityForm!:FormGroup
chart!:Chart
years!:Array<string>
codeCompanies!:Array<string>
listState!:Array<string>
listCity!:Array<string>

/*#########################################################################################
#############################################################################################
############################################################################################ */

constructor( private fp: FormBuilder,private modalService: NgbModal,private CauseDelayService:CauseDelayService) { }

/*#########################################################################################
#################################   NG ON INIT ##############################################
############################################################################################ */
// Ici on initialise le formulaire
ngOnInit(): void {
  this.inializeyears()
  //this.handelGetListCodeCompanies()
  this.handelGetListStates()
  

  this.CompanieForm=this.fp.group({
    codeCompanie: this.fp.control(null),
    codeStateOrigin: this.fp.control(null),
    codeStateDest:this.fp.control(null),
    year: this.fp.control(null),
    typeGraph:this.fp.control(null)
  })


}


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
}


/*#########################################################################################
#################################   APPEL API  ##############################################
############################################################################################ */

handelGetListStates(){
  this.CauseDelayService.getListStates().subscribe(
    {
      next:(data)=>{
        this.listState=data;
      },
      error :(err)=> {
        this.errorMessage="une erreur serveur s'est produite";
      }
    });
}

async handleDelayStates() : Promise<any>{
  let paramGraph=this.CompanieForm.value;
  let data = await this.CauseDelayService.delayStates(paramGraph["codeStateOrigin"],paramGraph["codeStateDest"]).toPromise();
  console.log(data)
  return data;
}

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


async  openGraphMeanDelayState(content: any) {
  //étape 1
  let data = await this.handleDelayStates();
  //étape 2
  this.openlg(content)
  //étape 3
  let text="Les retards selon les causes, depuis  "+this.CompanieForm.value["codeStateOrigin"]+ " à destination de " +this.CompanieForm.value["codeStateDest"]
  this.createCharCompanie(Object.values(data),text)
  //console.log(Object.keys(data))
}

//Fonction pour créer le graph chart.js en param: le data
createCharCompanie(data:any,text:string) {
  new Chart("chart1", {
    type: 'doughnut',
    data: {
      labels: ['CarrierDelay', 'LateAircraftDelay', 'NASDelay', 'SecurityDelay', 'WeatherDelay'],
      datasets: [{
        label: '# Minutes',
        data: data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      //cutoutPercentage: 40,
      responsive: false,

    }
  });
}

/*#########################################################################################
#############################################################################################
############################################################################################ */


}
