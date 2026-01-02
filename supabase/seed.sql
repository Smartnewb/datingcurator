-- Seed Data: 대전 대학가 데이트 장소 20개

INSERT INTO places (name, address, category, price_range, image_url, description, tags) VALUES

-- 카페 (6개)
('성심당 본점', '대전 중구 대종로480번길 15', 'cafe', 'low', 
 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400', 
 '대전의 상징! 튀김소보로와 판타롱부추빵이 유명한 70년 전통 베이커리 카페', 
 ARRAY['베이커리', '디저트', '분위기좋은', '데이트명소']),

('카페 루앤비', '대전 유성구 궁동로 31', 'cafe', 'medium',
 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400',
 '충남대 정문 앞 분위기 좋은 카페. 넓은 공간과 루프탑이 매력적',
 ARRAY['루프탑', '넓은공간', '충남대', '분위기좋은']),

('폴바셋 대전둔산점', '대전 서구 대덕대로 179', 'cafe', 'medium',
 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
 '퀄리티 높은 스페셜티 커피와 깔끔한 인테리어',
 ARRAY['스페셜티', '조용한', '모던한']),

('투썸플레이스 대전타임월드점', '대전 서구 대덕대로 211', 'cafe', 'medium',
 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400',
 '타임월드 쇼핑 후 디저트 즐기기 좋은 곳',
 ARRAY['디저트', '케이크', '쇼핑후']),

('카페 온마이마인드', '대전 유성구 어은로 47', 'cafe', 'low',
 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=400',
 'KAIST 근처 아늑한 분위기의 감성 카페',
 ARRAY['감성', '아늑한', 'KAIST', '조용한']),

('더벤티 충남대점', '대전 유성구 대학로 99', 'cafe', 'low',
 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=400',
 '가성비 좋은 대용량 음료. 학생들에게 인기',
 ARRAY['가성비', '대용량', '충남대', '학생할인']),

-- 식당 (6개)
('봉추찜닭 궁동점', '대전 유성구 궁동로8번길 12', 'restaurant', 'low',
 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400',
 '맛있고 양 많은 찜닭. 대학생 커플 데이트 맛집',
 ARRAY['한식', '찜닭', '양많은', '가성비']),

('곱창고 유성점', '대전 유성구 온천북로 39', 'restaurant', 'medium',
 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
 '신선한 곱창과 분위기 있는 인테리어',
 ARRAY['곱창', '야식', '분위기좋은']),

('서울깍두기 대전점', '대전 서구 둔산로 55', 'restaurant', 'low',
 'https://images.unsplash.com/photo-1583224994076-d49a49e7d8c4?w=400',
 '든든한 한식 백반. 집밥 느낌의 정갈한 밥상',
 ARRAY['한식', '백반', '가정식', '건강한']),

('이자카야 하나', '대전 유성구 봉명동 548-8', 'restaurant', 'medium',
 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=400',
 '분위기 있는 일본식 선술집. 사케와 안주가 맛있는 곳',
 ARRAY['일식', '술집', '분위기좋은', '저녁데이트']),

('피자파티 궁동점', '대전 유성구 궁동로 27', 'restaurant', 'low',
 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
 '학생들에게 인기 있는 가성비 피자집',
 ARRAY['피자', '양식', '가성비', '학생할인']),

('맛닭꼬 대전본점', '대전 중구 중앙로 170', 'restaurant', 'low',
 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400',
 '바삭한 치킨과 시원한 맥주의 조합',
 ARRAY['치킨', '맥주', '야식', '가성비']),

-- 디저트 (4개)
('설빙 대전둔산점', '대전 서구 둔산로 121', 'dessert', 'low',
 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
 '빙수 맛집! 인절미설빙이 시그니처',
 ARRAY['빙수', '디저트', '달달한', '여름']),

('뚜레쥬르 유성온천점', '대전 유성구 온천로 45', 'dessert', 'low',
 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400',
 '다양한 케이크와 빵. 선물용으로도 좋아요',
 ARRAY['베이커리', '케이크', '선물']),

('배스킨라빈스 타임월드점', '대전 서구 대덕대로 211', 'dessert', 'low',
 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400',
 '31가지 아이스크림. 영화 보고 먹기 좋아요',
 ARRAY['아이스크림', '달달한', '쇼핑후']),

('공차 충남대점', '대전 유성구 대학로 101', 'dessert', 'low',
 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400',
 '밀크티와 타로 음료가 맛있는 버블티 전문점',
 ARRAY['버블티', '밀크티', '충남대', '달달한']),

-- 액티비티 (4개)
('CGV 대전터미널', '대전 동구 동서대로 1689', 'activity', 'medium',
 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400',
 '최신 영화를 편안하게 즐길 수 있는 멀티플렉스',
 ARRAY['영화', '데이트', '실내', '저녁']),

('대전 엑스포 과학공원', '대전 유성구 대덕대로 480', 'activity', 'low',
 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
 '과학도시 대전의 상징. 낮 산책 데이트로 추천',
 ARRAY['산책', '공원', '야외', '낮데이트']),

('유성온천', '대전 유성구 온천로 77', 'activity', 'medium',
 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400',
 '피로 풀기 좋은 온천. 족욕 체험도 가능',
 ARRAY['온천', '힐링', '겨울', '커플']),

('보드게임카페 다이스', '대전 유성구 궁동로 25', 'activity', 'low',
 'https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=400',
 '다양한 보드게임을 즐길 수 있는 공간. 시간 가는 줄 몰라요',
 ARRAY['보드게임', '실내', '재미있는', '학생할인']);
