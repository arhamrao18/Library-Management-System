from django.core.management.base import BaseCommand
from django.utils import timezone
from manager.models import member, MembershipFee, FEE_DUE_DAY, MONTHLY_FEE_AMOUNT


class Command(BaseCommand):
    help = "Generates this month's fee record for every member (if missing) and marks overdue fees with a fine."

    def handle(self, *args, **options):
        today = timezone.now().date()
        month_start = today.replace(day=1)
        due_date = month_start.replace(day=FEE_DUE_DAY)

        # Step 1: Make sure every member has a fee record for the current month
        created_count = 0
        for m in member.objects.all():
            fee, created = MembershipFee.objects.get_or_create(
                member=m,
                month=month_start,
                defaults={
                    'due_date': due_date,
                    'amount': MONTHLY_FEE_AMOUNT,
                }
            )
            if created:
                created_count += 1

        # Step 2: Check all pending fees and mark overdue ones with a fine
        overdue_count = 0
        pending_fees = MembershipFee.objects.filter(status='Pending')
        for fee in pending_fees:
            old_status = fee.status
            fee.calculate_fine()  # this updates status + fine_amount internally if late
            if fee.status == 'Overdue' and old_status != 'Overdue':
                overdue_count += 1

        self.stdout.write(self.style.SUCCESS(
            f"Done. {created_count} new fee record(s) created. {overdue_count} fee(s) marked overdue."
        ))