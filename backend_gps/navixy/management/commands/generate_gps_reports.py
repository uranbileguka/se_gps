from django.core.management.base import BaseCommand
from navixy.services import generate_reports
import datetime


class Command(BaseCommand):
    help = 'Generate GPS reports for a specific date'

    def add_arguments(self, parser):
        parser.add_argument(
            '--date',
            type=str,
            help='Date in YYYY-MM-DD format (e.g., 2025-11-01)',
            default=None
        )

    def handle(self, *args, **options):
        date_str = options['date']
        
        if date_str:
            try:
                # Parse the date string
                report_date = datetime.datetime.strptime(date_str, '%Y-%m-%d').date()
                self.stdout.write(
                    self.style.SUCCESS(f'Generating reports for date: {report_date}')
                )
            except ValueError:
                self.stdout.write(
                    self.style.ERROR('Invalid date format. Please use YYYY-MM-DD')
                )
                return
        else:
            # Use yesterday as default
            report_date = datetime.date.today() - datetime.timedelta(days=1)
            self.stdout.write(
                self.style.WARNING(f'No date provided. Using yesterday: {report_date}')
            )
        
        try:
            generate_reports(date=report_date)
            self.stdout.write(
                self.style.SUCCESS(f'✅ Successfully generated reports for {report_date}')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Error generating reports: {str(e)}')
            )
