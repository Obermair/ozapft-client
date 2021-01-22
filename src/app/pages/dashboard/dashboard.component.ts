import { Component, OnDestroy } from "@angular/core";
import { NbThemeService } from "@nebular/theme";
import { takeWhile } from 'rxjs/operators' ;
import { HttpService } from "../../@core/utils/http.service";
import { NbToastrService, NbComponentStatus } from '@nebular/theme';
import { DataService } from "app/@core/utils/data.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Params } from "@angular/router";
interface CardSettings {
  title: string;
  desc: string;
  iconClass: string;
  type: string;
}

@Component({
  selector: "ngx-dashboard",
  styleUrls: ["./dashboard.component.scss"],
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent implements OnDestroy {
  
  private alive = true;

  solarValue: number;
  lightCard: CardSettings = {
    title: 'Hamburger',
    desc: 'mit Pommes',
    iconClass: '',
    type: 'primary',
  };
  rollerShadesCard: CardSettings = {
    title: 'Pizza',
    desc: 'mit Salami',
    iconClass: 'nb-roller-shades',
    type: 'success',
  };
  wirelessAudioCard: CardSettings = {
    title: 'Bier 0.5l',
    desc: 'Freistädter',
    iconClass: 'nb-audio',
    type: 'info',
  };
  coffeeMakerCard: CardSettings = {
    title: 'Kaffee',
    desc: 'Espresso',
    iconClass: 'nb-coffee-maker',
    type: 'warning',
  };
  spritzerCard: CardSettings = {
    title: 'Spritzer 0.3l',
    desc: 'Mit Soda',
    iconClass: 'nb-coffee-maker',
    type: 'warning',
  };

  colaCard: CardSettings = {
    title: 'Cola 0.3l',
    desc: '',
    iconClass: 'nb-coffee-maker',
    type: 'info',
  };

  statusCards: string;

  commonStatusCardsSet: CardSettings[] = [
    this.lightCard,
    this.rollerShadesCard,
    this.wirelessAudioCard,
    this.coffeeMakerCard,
    this.spritzerCard,
    this.colaCard,
  ];

  statusCardsByThemes: {
    default: CardSettings[];
    cosmic: CardSettings[];
    corporate: CardSettings[];
    dark: CardSettings[];
    origin : CardSettings[];
  } = {
    default: this.commonStatusCardsSet,
    cosmic: this.commonStatusCardsSet,
    corporate: [
      {
        ...this.lightCard,
        type: 'warning',
      },
      {
        ...this.rollerShadesCard,
        type: 'primary',
      },
      {
        ...this.wirelessAudioCard,
        type: 'danger',
      },
      {
        ...this.coffeeMakerCard,
        type: 'info',
      },
    ],
    dark: this.commonStatusCardsSet,
    origin: this.commonStatusCardsSet,
  };

  constructor(private themeService: NbThemeService, private http: HttpService, 
    public data: DataService, private route: ActivatedRoute) {
    
      this.themeService.getJsTheme()
        .pipe(takeWhile(() => this.alive))
        .subscribe(theme => {
          this.statusCards = this.statusCardsByThemes[theme.name];
      });


      if(this.data.paramInit){
        this.data.paramInit = true;    
        this.authenticateForFree();
        this.data.setVeranstalter(this.data.veranstalterId);
        this.data.loadArtikelByVeranstalter();
      }
  }

  

  ngOnDestroy() {
    this.alive = false;
  }

  printSampleBestellung(){
    this.http.printBestellung(1).subscribe(data => {
    });
  }

  authenticateForFree(){
      this.http.getToken(this.data.defaultKellner).subscribe(result => {
        if ( result ) {
          if(result == "user not found"){
            //this.data.showToast('top-right', 'danger', 'User nicht registriert');
          }
          else{
            localStorage.setItem('token', result);
            this.data.showToast('primary', "Automatisch eingeloggt.", 'bottom-end');
          }
        }
      });
  }

}
