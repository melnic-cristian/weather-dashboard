import { Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryScale, Chart, ChartConfiguration, ChartOptions, Filler, Legend, LinearScale, LineController, LineElement, PointElement, Title, Tooltip, type TooltipModel } from 'chart.js';
import { finalize, Subject, takeUntil } from 'rxjs';
import ErrorMessageComponent from '../../../shared/components/error/error.component';
import LoadingSpinnerComponent from '../../../shared/components/loading-spinner/loading-spinner.component';
import { SelectComponent } from '../../../shared/components/select/select.component'
import { IWeather, IWeatherChart } from '../model/weather.model';
import { WeatherService } from '../service/weather.service';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Legend, Tooltip, Filler);

@Component({
  standalone: true,
  selector: 'app-weather-dashboard',
  templateUrl: './weather-dashboard.component.html',
  styleUrl: './weather-dashboard.component.scss',
  imports: [LoadingSpinnerComponent, FormsModule, ErrorMessageComponent, SelectComponent]
})
export default class WeatherDashboardComponent implements OnInit, OnDestroy {
  @ViewChild('chartCanvas', {static: false}) chartCanvas!: ElementRef<HTMLCanvasElement>;

  isLoading = signal(false);
  error = signal<string | null>(null);

  predefinedLocations = [
    {latitude: 52.52, longitude: 13.41, name: 'Berlin, DE'},
    {latitude: 40.7128, longitude: -74.0060, name: 'New York, NY'},
    {latitude: 34.0522, longitude: -118.2437, name: 'Los Angeles, CA'},
    {latitude: 51.5074, longitude: -0.1278, name: 'London, UK'},
    {latitude: 48.8566, longitude: 2.3522, name: 'Paris, France'},
    {latitude: 35.6762, longitude: 139.6503, name: 'Tokyo, Japan'},
    {latitude: -33.8688, longitude: 151.2093, name: 'Sydney, Australia'},
    {latitude: 55.7558, longitude: 37.6176, name: 'Moscow, Russia'},
    {latitude: 39.9042, longitude: 116.4074, name: 'Beijing, China'}
  ];

  ranges = [7, 14, 30, 60, 90];

  selectedLocation = signal(this.predefinedLocations[0]);
  selectedDays = signal(14);
  chartData: IWeatherChart | null = null;
  chart: Chart<'line'> | null = null;

  private weatherService = inject(WeatherService);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadWeatherData();
  }

  ngOnDestroy(): void {
    this.destroyChart();
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadWeatherData(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.weatherService
      .getHistoricalWeatherData(this.selectedLocation().latitude, this.selectedLocation().longitude, this.selectedDays())
      .pipe(takeUntil(this.destroy$), finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data: IWeather) => {
          this.chartData = this.weatherService.transformToChartData(data);
          setTimeout(() => this.createChart(), 0);
        },
        error: (error) => {
          this.error.set(error.message);
          this.destroyChart();
        }
      });
  }

  onLocationChange(): void {
    this.loadWeatherData();
  }

  private createChart(): void {
    if (!this.chartCanvas || !this.chartData) return;

    this.destroyChart();

    const canvas = this.chartCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const options: ChartOptions<'line'> = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {intersect: false, mode: 'index'},
      plugins: {
        legend: {display: false},
        tooltip: {
          enabled: false,
          position: 'nearest',
          external: (ctx) => this.externalTooltipHandler(ctx),
          padding: 8,
          bodyFont: {size: 12, weight: 400},
          titleFont: {size: 13, weight: 600}
        }
      },
      scales: {
        x: {
          type: 'category',
          display: true,
          title: {display: true, text: 'Date', color: '#6b7280', font: {weight: 500}},
          grid: {color: 'rgba(0, 0, 0, 0.1)'}
        },
        y: {
          type: 'linear',
          display: true,
          title: {display: true, text: 'Temperature', color: '#6b7280', font: {weight: 500}},
          grid: {color: 'rgba(0, 0, 0, 0.1)'}
        }
      },
      elements: {
        point: {radius: 3, hoverRadius: 5},
        line: {borderWidth: 2}
      }
    };

    const config: ChartConfiguration<'line'> = {type: 'line', data: this.chartData, options };

    this.chart = new Chart<'line'>(ctx, config);
  }

  private destroyChart(): void {
    if (this.chart) {
      const parent = this.chart.canvas.parentNode as HTMLElement;
      const ext = parent?.querySelector('.tooltip');
      if (ext) ext.remove();

      this.chart.destroy();
      this.chart = null;
    }
  }

  private getOrCreateTooltip(chart: Chart): HTMLDivElement {
    const parent = chart.canvas.parentNode as HTMLElement;
    let tooltipEl = parent.querySelector('.tooltip') as HTMLDivElement | null;

    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.className = 'tooltip';
      tooltipEl.style.background = 'rgba(17, 24, 39, 0.9)';
      tooltipEl.style.borderRadius = '8px';
      tooltipEl.style.border = '1px solid rgba(255,255,255,0.12)';
      tooltipEl.style.color = 'white';
      tooltipEl.style.opacity = '1';
      tooltipEl.style.pointerEvents = 'none';
      tooltipEl.style.position = 'absolute';
      tooltipEl.style.transform = 'translate(-50%, 0)';
      tooltipEl.style.transition = 'opacity .12s ease, transform .12s ease';
      tooltipEl.style.maxWidth = '220px';
      tooltipEl.style.padding = '6px 8px';
      tooltipEl.style.font = '12px Segoe UI, sans-serif';

      const table = document.createElement('table');
      table.style.margin = '0';
      table.style.borderSpacing = '0';
      tooltipEl.appendChild(table);
      parent.appendChild(tooltipEl);
    }
    return tooltipEl;
  }

  private externalTooltipHandler(context: {chart: Chart; tooltip: TooltipModel<'line'>}) {
    const {chart, tooltip} = context as any;
    const tooltipEl = this.getOrCreateTooltip(chart);

    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = '0';
      return;
    }

    if (tooltip.body) {
      const titleLines: string[] = tooltip.title || [];
      const bodyLines: string[] = tooltip.body.map((b: any) => b.lines).flat();

      const tableRoot = tooltipEl.querySelector('table')!;
      while (tableRoot.firstChild) tableRoot.firstChild.remove();

      const thead = document.createElement('thead');
      titleLines.forEach(t => {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.style.textAlign = 'left';
        th.style.padding = '0 0 4px 0';
        th.style.fontWeight = '600';
        th.appendChild(document.createTextNode(t));
        tr.appendChild(th);
        thead.appendChild(tr);
      });

      const tbody = document.createElement('tbody');
      bodyLines.forEach((body: string, i: number) => {
        const colors = tooltip.labelColors?.[i];
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.style.whiteSpace = 'nowrap';

        if (colors) {
          const sw = document.createElement('span');
          sw.style.background = colors.backgroundColor;
          sw.style.border = `2px solid ${ colors.borderColor }`;
          sw.style.display = 'inline-block';
          sw.style.height = '10px';
          sw.style.width = '10px';
          sw.style.borderRadius = '2px';
          sw.style.marginRight = '2px';
          sw.style.verticalAlign = 'middle';

          td.style.display = 'flex';
          td.style.alignItems = 'center';
          td.style.gap = '6px';
          td.appendChild(sw);
        }

        td.appendChild(document.createTextNode(body));
        tr.appendChild(td);
        tbody.appendChild(tr);
      });

      tableRoot.appendChild(thead);
      tableRoot.appendChild(tbody);
    }

    const {offsetLeft: positionX, offsetTop: positionY} = chart.canvas;
    tooltipEl.style.opacity = '1';
    tooltipEl.style.left = positionX + tooltip.caretX + 'px';
    tooltipEl.style.top = positionY + tooltip.caretY + 10 + 'px';
    tooltipEl.style.font = tooltip.options.bodyFont

    const pad = (tooltip.options.padding as number) ?? 8;
    tooltipEl.style.padding = `${ pad }px`;
  }
}
