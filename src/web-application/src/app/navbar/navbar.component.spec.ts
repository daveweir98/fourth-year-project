import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain the nav links', () => {
      const compiled = fixture.debugElement.nativeElement;
      let navLinksExpected: string[] = ["Damage Analyser", "Appraisals", "Search", "Add Car"];
      let navLinksFound: NodeList = (compiled.querySelectorAll('a'));
      for (let navLinkIndex=0; navLinkIndex<navLinksFound.length;navLinkIndex++) {
        expect(navLinksFound[navLinkIndex].textContent).toContain(navLinksExpected[navLinkIndex])
      }
  });

});
