import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition, keyframes, AnimationStyleMetadata, AnimationMetadataType, state, query, stagger } from '@angular/animations';

function generateKeyframes() : AnimationStyleMetadata[]{
  const n = 30.0;
  const kfs : AnimationStyleMetadata[] = []
  
  for(let i=0; i<n+1; i++){

    const cos = Math.cos(Math.PI * i / n)
    const cosOffset = .5 - cos/10

    const sin = Math.sin(Math.PI * i / n);
    const sinOffset = .5 - sin/10

    const s = style({
      left : 100 * (cos/2 + cosOffset) + "%",
      bottom : 100 * (sin/2 + sinOffset) + "%", 
      transform: 'translate(-50%, -50%)',
      offset: i / n,
    })
    kfs.push(s);
  }

  console.log(kfs)

  return kfs;
}

@Component({
  selector: 'app-root',
  template: `
    <div
      [@semiCircle]="startAnimation ? 'start' : 'reset'"
      class="text-box"
      (click)="animateText()"
    >
      Semicircle
    </div>
    <div class="menu-icon" (click)="clickMenuIcon()">
      ☰
    </div>
    <div class="menu"
      [@menuState]="menuState"
    >
      <div class="menu-option" style="border-top: 2px solid black">
        Option 1
      </div>
      <div class="menu-option">
        Option 2
      </div>
      <div class="menu-option">
        Option 3
      </div>
      <div class="menu-option">
        Option 4
      </div>
      <div class="menu-option">
        Option 5
      </div>
      <div class="menu-option">
        Option 6
      </div>
      <div class="menu-option">
        Option 7
      </div>
    </div>
    <div  id="clippy-suggestions" >
      <img id="clippy" src="/assets/clippy.webp" alt="image">
      Hi! It looks like you were trying to plan your day. Can I help?
      <span @staggerAnimationTrigger *ngIf="displayedClippySuggestions.length > 0">
        <div @myInsertRemoveTrigger class="clippy-suggestion" *ngFor="let clippySuggestion of displayedClippySuggestions; let i=index" (click)="removeSuggestion(i)">
          {{clippySuggestion.text}}
        </div>
      </span>
    </div>
    
  `,
  styles: [
    `
      #clippy-suggestions {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }
      .clippy-suggestion {
        width: 250px;
        height: 50px;
        background-color: steelblue;
        margin: 8px;
        padding: 8px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .text-box {
        position: absolute;
        left: 90%;
        bottom: 50%;
        transform: translate(-50%, -50%);
        font-size: 24px;
        padding: 8px;
        background: lightblue;
        cursor: pointer;
      }

      .menu-icon {
        font-size: 24px;
        width: 24px;
      }

      .menu {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100px;
        padding: 8px;
      }

      .menu-option {
        display:flex;
        justify-content: center;
        align-items: center;
        background-color: gray;
        width: 100px;
        height: 40px;
        border-left: 2px solid black;
        border-bottom: 2px solid black;
        border-right: 2px solid black;
        font-family: Arial;
      }
    `,
  ],
  animations: [
    trigger('semiCircle', [
      transition('reset => start', [
        animate(
          '6s ease-in-out',
          keyframes(generateKeyframes())
        ),
      ]),
    ]),
    trigger('menuState', [
      state("shown", style({
        left: "0%",
        right: "0%",
        width: "100px",
      })),
      state("hidden", style({
        left: "-50%",
        right: "-50%",
        width: "100px",
      })),
      transition("hidden => shown", [
        animate('1s ease-in')
      ]),
      transition("shown => hidden", [
        animate('.5s ease-out')
      ])
    ]),
    trigger('myInsertRemoveTrigger', [
      //transition(':enter', [style({opacity: 0}), animate('500ms', style({opacity: 1}))]),
      transition(':leave', [animate('300ms'),style({ height: 0, opacity: 0, marginTop: 0, marginBottom: 0 })]),
    ]),
    trigger('staggerAnimationTrigger', [
      transition(':enter', [
        query('.clippy-suggestion', [
          style({opacity: 0, transform: 'translateX(-100px)'}),
          stagger(100, [
            animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', style({opacity: 1, transform: 'none'})),
          ]),
        ])
      ])
    ])
  ],
})
export class AppComponent implements OnInit {
  startAnimation = false;

  clippySuggestions : Array<{text : string, unblurred: boolean}> = [];
  displayedClippySuggestions : Array<{text: string, unblurred: boolean}> = [];

  menuState : "shown" | "hidden" = "hidden";

  animateText() {
    this.startAnimation = true; // Trigger the animation by changing the state.
    setTimeout(() => {
      this.startAnimation = false; // Reset the animation state to allow re-triggering.
    }, 6000); // Reset after the animation duration (3 seconds).
  }

  clickMenuIcon(){
    this.menuState = "shown";
    console.log(this.menuState)
  }

  getClippyData(){
    return [
      {text: "Tell her how you really feel", unblurred: true},
      {text: "Rig an election in Eastern Europe", unblurred: true},
      {text: "Build an engine from scratch", unblurred: true},
      {text: "Volunteer at the soup kitchen", unblurred: true},
      {text: "Learn the story of Darth Plagueis the Wise", unblurred: true}
    ]
  }

  removeSuggestion(i:number){
    this.displayedClippySuggestions = this.displayedClippySuggestions.filter((_, ind)=> {
      return (ind != i)
    })
  }

  ngOnInit(){
    generateKeyframes();

    const menu : Element | null = document.querySelector('.menu');
    const menuIcon : Element | null = document.querySelector('.menu-icon');

    setTimeout(() => {
      this.clippySuggestions = this.getClippyData();
      this.displayedClippySuggestions = this.getClippyData();
    }, 1000)
    

    document.addEventListener('click', (event) => {
      const withinMenu : boolean = event.composedPath().includes(menu as EventTarget);
      const withinMenuIcon : boolean = event.composedPath().includes(menuIcon as EventTarget);
      if(!withinMenu && !withinMenuIcon){
        this.menuState = "hidden";
      }
    })
  }
}