import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveMeetupsComponent } from './active-meetups.component';

describe('ActiveMeetupsComponent', () => {
  let component: ActiveMeetupsComponent;
  let fixture: ComponentFixture<ActiveMeetupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveMeetupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveMeetupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
