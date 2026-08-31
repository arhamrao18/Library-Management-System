from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from manager.models import member


class MemberJWTAuthentication(JWTAuthentication):
    """
    Custom JWT authentication for the `member` model.
    Django's default JWTAuthentication looks up auth.User via user_id claim,
    but our members are stored in the separate `member` model — so we
    override get_user() to fetch from there instead, using the m_id claim.
    """

    def get_user(self, validated_token):
        try:
            member_id = validated_token['member_id']
        except KeyError:
            raise AuthenticationFailed('Token contained no recognizable member identification')

        try:
            m = member.objects.get(m_id=member_id)
        except member.DoesNotExist:
            raise AuthenticationFailed('Member not found', code='member_not_found')

        # DRF expects an object with `is_authenticated`; we fake it here
        m.is_authenticated = True
        return m