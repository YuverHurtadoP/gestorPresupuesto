import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GithubFabComponent } from './github-fab.component';

describe('GithubFabComponent', () => {
  let component: GithubFabComponent;
  let fixture: ComponentFixture<GithubFabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GithubFabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GithubFabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
