import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FaqService } from '../../../core/services/faq.service';
import { Faq } from '../../../core/models/faq.model';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent implements OnInit {
  faqs: Faq[] = [];
  cargando = true;

  constructor(
    private location: Location,
    private faqSvc: FaqService
  ) {}

  ngOnInit(): void {
    this.faqSvc.getAllPublic().subscribe({
      next: (data) => {
        this.faqs = data.filter(f => f.activo === 1);
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }

  volver(): void {
    this.location.back();
  }
}
