-- Moodboard Investigation Platform - Database Schema
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table is managed by Supabase Auth automatically

-- Boards
CREATE TABLE boards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled Board',
  description TEXT,
  visibility TEXT DEFAULT 'private' CHECK (visibility IN ('private', 'public', 'unlisted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Semantic categories (global, pre-populated)
CREATE TABLE semantic_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  parent_id UUID REFERENCES semantic_categories(id),
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert base categories
INSERT INTO semantic_categories (name, icon, color) VALUES
  ('person', 'user', '#3B82F6'),
  ('organization', 'building-2', '#8B5CF6'),
  ('event', 'calendar', '#F59E0B'),
  ('location', 'map-pin', '#10B981'),
  ('document', 'file-text', '#6366F1');

-- Subcategories for Person
INSERT INTO semantic_categories (name, parent_id, icon, color)
SELECT 'lawyer', id, 'briefcase', '#3B82F6' FROM semantic_categories WHERE name = 'person';

INSERT INTO semantic_categories (name, parent_id, icon, color)
SELECT 'judge', id, 'gavel', '#3B82F6' FROM semantic_categories WHERE name = 'person';

INSERT INTO semantic_categories (name, parent_id, icon, color)
SELECT 'politician', id, 'landmark', '#3B82F6' FROM semantic_categories WHERE name = 'person';

INSERT INTO semantic_categories (name, parent_id, icon, color)
SELECT 'witness', id, 'eye', '#3B82F6' FROM semantic_categories WHERE name = 'person';

-- Subcategories for Organization
INSERT INTO semantic_categories (name, parent_id, icon, color)
SELECT 'company', id, 'building', '#8B5CF6' FROM semantic_categories WHERE name = 'organization';

INSERT INTO semantic_categories (name, parent_id, icon, color)
SELECT 'university', id, 'graduation-cap', '#8B5CF6' FROM semantic_categories WHERE name = 'organization';

INSERT INTO semantic_categories (name, parent_id, icon, color)
SELECT 'government', id, 'landmark', '#8B5CF6' FROM semantic_categories WHERE name = 'organization';

-- Node sets (grouping)
CREATE TABLE node_sets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Nodes
CREATE TABLE nodes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  semantic_category_id TEXT NOT NULL,
  name TEXT NOT NULL,
  label TEXT,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  position_x FLOAT DEFAULT 0,
  position_y FLOAT DEFAULT 0,
  locked_position BOOLEAN DEFAULT FALSE,
  set_id UUID REFERENCES node_sets(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Edges
CREATE TABLE edges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  source_node_id UUID REFERENCES nodes(id) ON DELETE CASCADE,
  target_node_id UUID REFERENCES nodes(id) ON DELETE CASCADE,
  label TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  weight FLOAT DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents
CREATE TABLE documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed BOOLEAN DEFAULT FALSE,
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  extracted_text TEXT,
  metadata JSONB DEFAULT '{}'
);

-- AI Suggestions (human-in-the-loop)
CREATE TABLE ai_suggestions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  suggestion_type TEXT NOT NULL CHECK (suggestion_type IN ('node', 'edge', 'connection')),
  confidence FLOAT CHECK (confidence >= 0 AND confidence <= 1),
  data JSONB NOT NULL,
  evidence JSONB DEFAULT '[]',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  acted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX idx_boards_owner ON boards(owner_id);
CREATE INDEX idx_nodes_board ON nodes(board_id);
CREATE INDEX idx_nodes_category ON nodes(semantic_category_id);
CREATE INDEX idx_edges_board ON edges(board_id);
CREATE INDEX idx_edges_source ON edges(source_node_id);
CREATE INDEX idx_edges_target ON edges(target_node_id);
CREATE INDEX idx_documents_board ON documents(board_id);
CREATE INDEX idx_ai_suggestions_board ON ai_suggestions(board_id);
CREATE INDEX idx_ai_suggestions_status ON ai_suggestions(status);

-- Row Level Security (RLS)
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE node_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_suggestions ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only see their own boards
CREATE POLICY "Users can view own boards" ON boards
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own boards" ON boards
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own boards" ON boards
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own boards" ON boards
  FOR DELETE USING (auth.uid() = owner_id);

-- Policies for nodes (access via board ownership)
CREATE POLICY "Users can view nodes in own boards" ON nodes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM boards WHERE boards.id = nodes.board_id AND boards.owner_id = auth.uid())
  );

CREATE POLICY "Users can insert nodes in own boards" ON nodes
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM boards WHERE boards.id = nodes.board_id AND boards.owner_id = auth.uid())
  );

CREATE POLICY "Users can update nodes in own boards" ON nodes
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM boards WHERE boards.id = nodes.board_id AND boards.owner_id = auth.uid())
  );

CREATE POLICY "Users can delete nodes in own boards" ON nodes
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM boards WHERE boards.id = nodes.board_id AND boards.owner_id = auth.uid())
  );

-- Similar policies for edges
CREATE POLICY "Users can view edges in own boards" ON edges
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM boards WHERE boards.id = edges.board_id AND boards.owner_id = auth.uid())
  );

CREATE POLICY "Users can insert edges in own boards" ON edges
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM boards WHERE boards.id = edges.board_id AND boards.owner_id = auth.uid())
  );

CREATE POLICY "Users can update edges in own boards" ON edges
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM boards WHERE boards.id = edges.board_id AND boards.owner_id = auth.uid())
  );

CREATE POLICY "Users can delete edges in own boards" ON edges
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM boards WHERE boards.id = edges.board_id AND boards.owner_id = auth.uid())
  );

-- Policies for node_sets
CREATE POLICY "Users can view sets in own boards" ON node_sets
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM boards WHERE boards.id = node_sets.board_id AND boards.owner_id = auth.uid())
  );

CREATE POLICY "Users can insert sets in own boards" ON node_sets
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM boards WHERE boards.id = node_sets.board_id AND boards.owner_id = auth.uid())
  );

CREATE POLICY "Users can update sets in own boards" ON node_sets
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM boards WHERE boards.id = node_sets.board_id AND boards.owner_id = auth.uid())
  );

CREATE POLICY "Users can delete sets in own boards" ON node_sets
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM boards WHERE boards.id = node_sets.board_id AND boards.owner_id = auth.uid())
  );

-- Policies for documents
CREATE POLICY "Users can view documents in own boards" ON documents
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM boards WHERE boards.id = documents.board_id AND boards.owner_id = auth.uid())
  );

CREATE POLICY "Users can insert documents in own boards" ON documents
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM boards WHERE boards.id = documents.board_id AND boards.owner_id = auth.uid())
  );

CREATE POLICY "Users can update documents in own boards" ON documents
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM boards WHERE boards.id = documents.board_id AND boards.owner_id = auth.uid())
  );

CREATE POLICY "Users can delete documents in own boards" ON documents
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM boards WHERE boards.id = documents.board_id AND boards.owner_id = auth.uid())
  );

-- Policies for ai_suggestions
CREATE POLICY "Users can view suggestions in own boards" ON ai_suggestions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM boards WHERE boards.id = ai_suggestions.board_id AND boards.owner_id = auth.uid())
  );

CREATE POLICY "Users can insert suggestions in own boards" ON ai_suggestions
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM boards WHERE boards.id = ai_suggestions.board_id AND boards.owner_id = auth.uid())
  );

CREATE POLICY "Users can update suggestions in own boards" ON ai_suggestions
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM boards WHERE boards.id = ai_suggestions.board_id AND boards.owner_id = auth.uid())
  );

CREATE POLICY "Users can delete suggestions in own boards" ON ai_suggestions
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM boards WHERE boards.id = ai_suggestions.board_id AND boards.owner_id = auth.uid())
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_boards_updated_at BEFORE UPDATE ON boards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nodes_updated_at BEFORE UPDATE ON nodes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_edges_updated_at BEFORE UPDATE ON edges
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Storage bucket for documents (run this in Supabase dashboard)
-- CREATE STORAGE BUCKET documents;
--
-- CREATE POLICY "Users can upload documents" ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');
--
-- CREATE POLICY "Users can view own documents" ON storage.objects FOR SELECT
--   USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
