// To test the creation of a new instance of the about component:
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutComponent } from './about.component';

describe('About Component', () => {
  // By using a fixture will be more easy to access to the properties of a component:
  let fixture: ComponentFixture<AboutComponent>;
  let component: AboutComponent;

  // Initialize the component before running the test:
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AboutComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutComponent);// New instance component.
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});