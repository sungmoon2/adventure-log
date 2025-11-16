#!/bin/bash
# MoAI-ADK Haiku to Sonnet Migration Script
# Purpose: Permanently replace all Haiku references with Sonnet
# Usage: Run this after /alfred:0-project if Haiku appears

echo "🔄 Starting Haiku to Sonnet migration..."

# 1. Fix agent model configurations
echo "📝 Updating agent configurations..."
agents=(
    "doc-syncer"
    "git-manager"
    "trust-checker"
    "quality-gate"
    "tdd-implementer"
)

for agent in "${agents[@]}"; do
    file=".claude/agents/alfred/${agent}.md"
    if [ -f "$file" ]; then
        sed -i 's/model: haiku/model: sonnet/g' "$file"
        echo "  ✅ Updated $agent"
    fi
done

# 2. Fix command configurations
echo "📝 Updating command configurations..."
if [ -f ".claude/commands/alfred/3-sync.md" ]; then
    sed -i 's/model: "haiku"/model: "sonnet"/g' .claude/commands/alfred/3-sync.md
    echo "  ✅ Updated alfred:3-sync"
fi

# 3. Update CLAUDE.md if exists
if [ -f "CLAUDE.md" ]; then
    echo "📝 Updating CLAUDE.md..."
    sed -i 's/Haiku 4\.5/Sonnet 4.5/g' CLAUDE.md
    sed -i 's/haiku/sonnet/g' CLAUDE.md
    echo "  ✅ Updated CLAUDE.md"
fi

# 4. Verify changes
echo ""
echo "🔍 Verification:"
echo "Remaining Haiku references in agents:"
grep -l "model: haiku" .claude/agents/alfred/*.md 2>/dev/null || echo "  ✅ None found!"

echo ""
echo "✨ Migration complete!"
echo "💡 Tip: Commit these changes to Git to preserve them:"
echo "  git add .claude/ CLAUDE.md"
echo "  git commit -m 'fix: migrate all agents from Haiku to Sonnet'"