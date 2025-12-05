from rest_framework import serializers
from .models import Task, Comment
from members.serializers import MemberSerializer

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'task', 'content', 'created_at')
        read_only_fields = ('task', 'created_at')

class TaskSerializer(serializers.ModelSerializer):
    assignee_details = MemberSerializer(source='assignee', read_only=True)

    class Meta:
        model = Task
        fields = (
            'id', 'title', 'description', 'status', 'assignee', 'assignee_details',
            'due_date', 'created_at', 'updated_at'
        )
        read_only_fields = ('created_at', 'updated_at')
