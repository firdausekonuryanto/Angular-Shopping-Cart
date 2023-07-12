import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeliComponent } from './beli.component';

describe('BeliComponent', () => {
  let component: BeliComponent;
  let fixture: ComponentFixture<BeliComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BeliComponent]
    });
    fixture = TestBed.createComponent(BeliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
