-- Add major cities of Andhra Pradesh
INSERT INTO public.districts (name, state, code) VALUES
('Guntur', 'Andhra Pradesh', 'GNT'),
('Nellore', 'Andhra Pradesh', 'NLR'),
('Kurnool', 'Andhra Pradesh', 'KNL'),
('Kadapa', 'Andhra Pradesh', 'KDP'),
('Anantapur', 'Andhra Pradesh', 'ATP')
ON CONFLICT (name) DO NOTHING;
