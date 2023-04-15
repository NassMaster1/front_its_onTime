import {Component, OnInit, TemplateRef} from '@angular/core';
import Chart from 'chart.js/auto';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup} from "@angular/forms";
import {CompanieService} from "../../services/companies/companie.service";

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit{

  closeResult!:string;
  errorMessage!:string
  CompanieForm!:FormGroup
  StatesForm!:FormGroup
  chart!:Chart
  years!:Array<number>
  codeCompanies!:Array<string>
  listState!:Array<string>

  constructor( private fp: FormBuilder,private modalService: NgbModal,private companieService:CompanieService) { }

  // Ici on initialise le formulaire
  ngOnInit(): void {
    this.inializeyears()
    this.handelGetListCodeCompanies()
    this.handelGetListStates()

    this.CompanieForm=this.fp.group({
      codeCompanie: this.fp.control(null),
      year: this.fp.control(null),
      typeGraph:this.fp.control(null)
    })

    this.StatesForm=this.fp.group({
      codeStateOrigin: this.fp.control(null),
      codeStateDest:this.fp.control(null),
      year: this.fp.control(null),
      typeGraph:this.fp.control(null)

    })

  }

  private inializeyears(){
    const years: number[] = [];

    for (let i = 2004; i <= 2020; i++) {
      years.push(i);
    }
    this.years=years
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

  handelGetListStates(){
    this.companieService.getListStates().subscribe(
      {
        next:(data)=>{
          this.listState=data;
        },
        error :(err)=> {
          this.errorMessage="une erreur serveur s'est produite";
        }
      });
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

 // Fonction qui appelle l'API et retuen un Promise Any pour la syncronisation
  async handleMeanDelayCompanies() : Promise<any>{
    let paramGraph=this.CompanieForm.value;
    let data = await this.companieService.meanDelayCompanies(paramGraph["codeCompanie"],paramGraph["year"]).toPromise();
    return data;
  }

  //étape 1- La fonction pour appeller notre fonction de l'api
  //étape 2- Appeler la fonction openlg pour ouvrir la fenetre ou afficher le graph
  //étape 33-Appeler la fonction "createChartMeanDelayCompanie" pour creer le graph Chart.js en param: nos données récuperer depuis la fonction "handleMeanDelayCompanies"
  async openGraphMeanDelayCompanies(content: any) {
    //étape 1
    let data = await this.handleMeanDelayCompanies();
    //étape 2
    this.openlg(content)
    //étape 3
    let text="Retard des avions pour la companie "+this.CompanieForm.value["codeCompanie"] + " pour l\'anée: "+this.CompanieForm.value["year"]
    this.createCharCompanie(data["mean_delay"],text,this.CompanieForm.value["typeGraph"])
  }

  //Fonction pour créer le graph chart.js en param: le data
  createCharCompanie(data:any,text:string,typeGraph:string) {
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


  async  openCancelledbyyCompanies(content: any) {
    //étape 1
    let data = await this.handleCancelledCompanies();
    //étape 2
    this.openlg(content)
    //étape 3
    let text="Vols annulés pour la companie "+this.CompanieForm.value["codeCompanie"] + " pour l\'anée: "+this.CompanieForm.value["year"]
    this.createCharCompanie(data["sum_cancelled"],text,this.CompanieForm.value["typeGraph"])
  }

  async handleCancelledCompanies() : Promise<any>{
    let paramGraph=this.CompanieForm.value;
    let data = await this.companieService.CancelledCompanies(paramGraph["codeCompanie"],paramGraph["year"]).toPromise();
    return data;
  }

  async  openGraphMeanDelayState(content: any) {
    //étape 1
    let data = await this.handleDelayStates();
    //étape 2
    this.openlg(content)
    //étape 3
    let text="retards selon l'état "+this.StatesForm.value["codeStateOrigin"] + " pour l\'anée: "+this.StatesForm.value["year"]
    this.createCharCompanie(data["mean_delay"],text,this.StatesForm.value["typeGraph"])
  }

  async handleDelayStates() : Promise<any>{
    let paramGraph=this.StatesForm.value;
    let data = await this.companieService.delayStates(paramGraph["codeStateOrigin"],paramGraph["codeStateDest"],paramGraph["year"]).toPromise();
    return data;
  }

}
