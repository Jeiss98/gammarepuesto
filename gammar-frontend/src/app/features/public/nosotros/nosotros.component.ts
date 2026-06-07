import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InfoNegocioService } from '../../../core/services/info-negocio.service';
import { InfoNegocio } from '../../../core/models/info-negocio.model';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './nosotros.component.html',
  styleUrl: './nosotros.component.css'
})
export class NosotrosComponent implements OnInit {
  info: InfoNegocio | null = null;
  cargando = true;

  constructor(
    private location: Location,
    private infoSvc: InfoNegocioService
  ) {}

  ngOnInit(): void {
    this.infoSvc.get().subscribe({
      next: (res) => {
        this.info = res;
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }

  volver(): void {
    this.location.back();
  }
}
