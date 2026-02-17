import sqlparse


class PermissionChain:

    BLOCKED = {"DROP", "GRANT", "REVOKE"}
    CONFIRM = {"INSERT", "UPDATE", "DELETE", "CREATE", "ALTER"}

    def classify(self, sql: str) -> str:
        parsed = sqlparse.parse(sql)
        if not parsed:
            return "BLOCKED"

        statement = parsed[0]
        token = statement.tokens[0].value.upper()

        if token in self.BLOCKED:
            return "BLOCKED"

        if token in self.CONFIRM:
            return "CONFIRM_REQUIRED"

        if token == "SELECT":
            return "ALLOW"

        return "BLOCKED"
