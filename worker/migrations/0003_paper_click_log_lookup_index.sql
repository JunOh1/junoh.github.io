CREATE INDEX IF NOT EXISTS idx_visitor_logs_paper_click_match
ON visitor_logs (ip, path, ts);
