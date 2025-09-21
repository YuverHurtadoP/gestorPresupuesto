import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
interface ActionOption {
  key: string;       // identificador de la acción (ej: 'ver', 'editar')
  label: string;     // nombre que se muestra (ej: 'Ver detalle')
  icon: string;      // icono (puede ser emoji o clase)
  color?: string;    // color opcional (ej: 'text-red-600')
  visible?: boolean; // si se muestra o no
}
@Component({
  selector: 'app-list-common',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-common.component.html',
  styleUrl: './list-common.component.css'
})
export class ListCommonComponent implements OnInit {

  @Input() data: any[] = [];

  openMenuIndex: number | null = null;
  ngOnInit(): void {
    console.log('Method not implemented.' + JSON.stringify(this.data));
  }

  toggleMenu(index: number) {
    this.openMenuIndex = this.openMenuIndex === index ? null : index;
  }
  @Input() actions: ActionOption[] = [
    { key: 'ver', label: 'Ver', icon: '👁', color: 'text-purple-600', visible: true },
    { key: 'editar', label: 'Editar', icon: '✏', color: 'text-blue-600', visible: true },
    { key: 'eliminar', label: 'Eliminar', icon: '🗑', color: 'text-red-600', visible: true }
  ];

  @Output() action = new EventEmitter<{ key: string, item: any }>();
  onAction(key: string, item: any) {
    this.action.emit({ key, item });
    this.openMenuIndex = null; // cerrar menú al hacer clic
  }
}
