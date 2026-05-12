<script lang="ts">
	import { onMount } from 'svelte';

	const WEDDING = new Date('2026-12-12T16:00:00');

	let dday    = $state(0);
	let scroll  = $state(0);
	let toastMsg = $state('');
	let toastOn  = $state(false);
	let lbOpen   = $state(false);
	let lbIdx    = $state(0);
	let groomOpen = $state(false);
	let brideOpen = $state(false);

	interface Msg { id: number; name: string; text: string; date: string }
	let msgs   = $state<Msg[]>([]);
	let gbName = $state('');
	let gbText = $state('');

	// ─── 사진 src를 실제 경로로 교체하세요 ───────────────────────
	// 커버 사진
	const COVER_SRC = 'https://picsum.photos/seed/cover2/480/640';
	// 신랑/신부 프로필
	const GROOM_SRC = 'https://picsum.photos/seed/groom/300/400';
	const BRIDE_SRC = 'https://picsum.photos/seed/bride/300/400';
	// 갤러리 (6장)
	const photos = [
		{ src: 'https://picsum.photos/seed/g1/480/600', alt: '웨딩 사진 1' },
		{ src: 'https://picsum.photos/seed/g2/400/530', alt: '웨딩 사진 2' },
		{ src: 'https://picsum.photos/seed/g3/400/530', alt: '웨딩 사진 3' },
		{ src: 'https://picsum.photos/seed/g4/480/600', alt: '웨딩 사진 4' },
		{ src: 'https://picsum.photos/seed/g5/400/530', alt: '웨딩 사진 5' },
		{ src: 'https://picsum.photos/seed/g6/400/530', alt: '웨딩 사진 6' },
	];

	// Dec 2026: 1일 = 화요일
	const calRows = [
		[null, null, 1,  2,  3,  4,  5 ],
		[6,    7,    8,  9,  10, 11, 12],
		[13,   14,   15, 16, 17, 18, 19],
		[20,   21,   22, 23, 24, 25, 26],
		[27,   28,   29, 30, 31, null, null],
	];

	// ─── 계좌번호 교체하세요 ─────────────────────────────────────
	const accounts = {
		groom: [
			{ label: '신랑 제영헌', bank: '카카오뱅크', num: '3333-00-0000000' },
			{ label: '아버지 제민호', bank: '신한은행',  num: '110-000-000000'  },
			{ label: '어머니 김점덕', bank: '국민은행',  num: '123-00-0000-000' },
		],
		bride: [
			{ label: '신부 윤정서',  bank: '카카오뱅크', num: '3333-00-0000000' },
			{ label: '아버지 윤종수', bank: '우리은행',  num: '1002-000-000000' },
			{ label: '어머니 최미정', bank: '농협은행',  num: '301-0000-0000-00' },
		],
	};

	onMount(() => {
		dday = Math.ceil((WEDDING.getTime() - Date.now()) / 86400000);

		try {
			const s = localStorage.getItem('wg');
			if (s) msgs = JSON.parse(s);
		} catch {}

		const onScroll = () => {
			const el = document.documentElement;
			scroll = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
		};
		window.addEventListener('scroll', onScroll, { passive: true });

		const obs = new IntersectionObserver(
			(entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('on'); }),
			{ threshold: 0.07 }
		);
		document.querySelectorAll('.fi').forEach((el) => obs.observe(el));

		return () => { window.removeEventListener('scroll', onScroll); obs.disconnect(); };
	});

	function toast(m: string) { toastMsg = m; toastOn = true; setTimeout(() => (toastOn = false), 2000); }
	async function copy(text: string, label: string) {
		try { await navigator.clipboard.writeText(text); toast(`${label} 복사됨`); }
		catch { toast('복사 실패'); }
	}
	function addMsg() {
		if (!gbName.trim() || !gbText.trim()) return;
		const m: Msg = { id: Date.now(), name: gbName.trim(), text: gbText.trim(), date: new Date().toLocaleDateString('ko-KR') };
		msgs = [m, ...msgs];
		localStorage.setItem('wg', JSON.stringify(msgs));
		gbName = ''; gbText = '';
		toast('메시지가 등록되었습니다 ♡');
	}
	async function shareLink() {
		if (navigator.share) await navigator.share({ title: '제영헌 ♥ 윤정서 결혼합니다', url: location.href });
		else await copy(location.href, '링크');
	}
	function openLb(i: number) { lbIdx = i; lbOpen = true; }
	function prev() { lbIdx = (lbIdx - 1 + photos.length) % photos.length; }
	function next() { lbIdx = (lbIdx + 1) % photos.length; }
</script>

<div id="scroll-progress" style="width:{scroll}%"></div>

<!-- ═══════════════════════════════════════════════════════════
     1. COVER  —  흰 배경 + 타이포 + 인셋 사진
═══════════════════════════════════════════════════════════ -->
<section class="cover">
	<div class="cover-inner">
		<!-- 스크립트 타이틀 -->
		<div class="cover-title-wrap fi">
			<span class="cover-script">Better</span>
			<!-- 인셋 사진: 실제 커버 사진으로 교체 -->
			<div class="cover-inset">
				<img src={COVER_SRC} alt="커버 사진" />
			</div>
			<span class="cover-script">Together</span>
		</div>

		<div class="cover-info fi d2">
			<div class="cover-names">
				<span class="cover-name-kr">제영헌</span>
				<span class="cover-heart">♥</span>
				<span class="cover-name-kr">윤정서</span>
			</div>
			<p class="cover-name-en">Je Yeong-heon &amp; Yun Jeong Seo</p>
			<hr class="cover-rule" />
			<p class="cover-date-txt">2026 · 12 · 12 토요일 오후 4시</p>
			<p class="cover-venue-txt">벡스코 W웨딩홀 · 부산</p>
		</div>
	</div>

	<!-- 아래 스크롤 힌트 -->
	<div class="cover-scroll fi d3">
		<div class="scroll-dot"></div>
	</div>
</section>

<hr class="hr" />

<!-- ═══════════════════════════════════════════════════════════
     2. 인사말
═══════════════════════════════════════════════════════════ -->
<section class="sec" style="text-align:center">
	<span class="lbl fi">Invitation</span>
	<hr class="hr-sm fi d1" />

	<div class="fi d2" style="max-width:290px;margin:0 auto">
		<p class="invite-title">소중한 분들을 초대합니다</p>
		<p class="invite-body">
			햇살처럼 따뜻하게 안아줄 수 있는<br />
			늘 곁에서 서로를 웃게 해줄 수 있는<br />
			소중한 사람을 만났습니다.
		</p>
		<p class="invite-body">
			기쁜 날, 가까이서 축복해 주시면<br />
			더없는 기쁨으로 간직하겠습니다.
		</p>
	</div>

	<hr class="hr-sm fi d3" />
</section>

<hr class="hr" />

<!-- ═══════════════════════════════════════════════════════════
     3. 신랑신부 소개
═══════════════════════════════════════════════════════════ -->
<section class="sec" style="text-align:center;background:var(--sky-bg)">
	<span class="lbl fi">The Couple</span>

	<div class="couple fi d1">
		<!-- 신랑 -->
		<div class="person">
			<div class="p-img-wrap">
				<img src={GROOM_SRC} alt="신랑 사진" />
			</div>
			<p class="p-role">신랑</p>
			<p class="p-name">제영헌</p>
			<p class="p-parents">제민호 · 김점덕의 차남</p>
			<!-- 실제 전화번호로 교체 -->
			<a href="tel:010-0000-0000" class="btn-ghost p-call">
				<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-15.72-15.71 2 2 0 0 1 1.98-2.18h3a2 2 0 0 1 2 1.72c.12.96.37 1.9.74 2.79a2 2 0 0 1-.45 2.11L9.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.37 1.83.62 2.79.74A2 2 0 0 1 22 16.92z"/>
				</svg>
				연락하기
			</a>
		</div>

		<div class="couple-mid">
			<span class="couple-heart">♥</span>
		</div>

		<!-- 신부 -->
		<div class="person">
			<div class="p-img-wrap">
				<img src={BRIDE_SRC} alt="신부 사진" />
			</div>
			<p class="p-role">신부</p>
			<p class="p-name">윤정서</p>
			<p class="p-parents">윤종수 · 최미정의 장녀</p>
			<a href="tel:010-0000-0001" class="btn-ghost p-call">
				<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-15.72-15.71 2 2 0 0 1 1.98-2.18h3a2 2 0 0 1 2 1.72c.12.96.37 1.9.74 2.79a2 2 0 0 1-.45 2.11L9.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.37 1.83.62 2.79.74A2 2 0 0 1 22 16.92z"/>
				</svg>
				연락하기
			</a>
		</div>
	</div>
</section>

<hr class="hr" />

<!-- ═══════════════════════════════════════════════════════════
     4. 예식 일시
═══════════════════════════════════════════════════════════ -->
<section class="sec" style="text-align:center">
	<span class="lbl fi">Date &amp; Time</span>

	<div class="fi d1">
		<p class="dt-main">2026년 12월 12일 토요일</p>
		<p class="dt-sub">오후 4시</p>
	</div>

	<div class="dday-box fi d2">
		{#if dday > 0}
			<span class="dd-d">D</span><span class="dd-dash">-</span><span class="dd-num">{dday}</span>
		{:else if dday === 0}
			<span class="dd-d">D-Day</span>
		{:else}
			<span class="dd-d">+{Math.abs(dday)}</span>
		{/if}
	</div>

	<hr class="hr-sm fi d2" />

	<div class="fi d3">
		<p class="cal-month-lbl">December 2026</p>
		<table class="cal-table">
			<thead>
				<tr><th>일</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th><th>토</th></tr>
			</thead>
			<tbody>
				{#each calRows as row}
					<tr>
						{#each row as d, ci}
							<td class="{ci===0?'sun':''}{ci===6?' sat':''}{d===12?' wd':''}">
								{#if d===12}<span>{d}</span>{:else}{d??''}{/if}
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>

<hr class="hr" />

<!-- ═══════════════════════════════════════════════════════════
     5. 예식장 위치
═══════════════════════════════════════════════════════════ -->
<section class="sec" style="background:var(--sky-bg)">
	<span class="lbl fi">Location</span>

	<div class="fi d1" style="text-align:center;margin:2rem 0 1.5rem">
		<p class="venue-name">벡스코 W웨딩홀</p>
		<p class="venue-hall">제 1전시장 지하 1층 · 단독홀</p>
		<p class="venue-addr">부산 해운대구 APEC로 55</p>
	</div>

	<a href="https://map.kakao.com/link/map/벡스코,35.1690,129.1280" target="_blank" rel="noopener" class="map-box fi d2">
		<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--terra)" stroke-width="1.4">
			<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
			<circle cx="12" cy="9" r="2.5"/>
		</svg>
		<span>탭하여 카카오맵 열기</span>
	</a>

	<div class="map-links fi d2">
		<a href="https://map.kakao.com/link/map/벡스코,35.1690,129.1280" target="_blank" rel="noopener" class="btn-ghost">카카오맵</a>
		<a href="https://map.naver.com/v5/search/벡스코" target="_blank" rel="noopener" class="btn-ghost">네이버맵</a>
		<button class="btn-ghost" onclick={() => copy('부산 해운대구 APEC로 55', '주소')}>주소 복사</button>
	</div>

	<div class="fi d3" style="margin-top:2rem">
		<div class="tp-item">
			<span class="tp-icon">🚇</span>
			<div>
				<p class="tp-name">지하철</p>
				<p class="tp-desc">동해선 BEXCO역 1번 출구 도보 5분<br />2호선 센텀시티역 5번 출구 도보 10분</p>
			</div>
		</div>
		<div class="tp-item">
			<span class="tp-icon">🚌</span>
			<div>
				<p class="tp-name">버스</p>
				<p class="tp-desc">BEXCO 정류장 하차 · 139, 141, 1003번 등</p>
			</div>
		</div>
		<div class="tp-item" style="border-bottom:none">
			<span class="tp-icon">🚗</span>
			<div>
				<p class="tp-name">자가용</p>
				<p class="tp-desc">벡스코 지하 주차장 이용 · 행사 당일 혼잡 예상</p>
			</div>
		</div>
	</div>
</section>

<hr class="hr" />

<!-- ═══════════════════════════════════════════════════════════
     6. 갤러리  —  Our Story 헤더 + 교차 레이아웃
═══════════════════════════════════════════════════════════ -->
<section>
	<!-- Our Story 헤더 -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="story-header fi" onclick={() => openLb(0)}>
		<img src={photos[0].src} alt="Our Story" />
		<div class="story-overlay">
			<span class="story-script">Our Story</span>
		</div>
	</div>

	<!-- 2단 -->
	<div class="gal-two fi d1">
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="gal-two-item" onclick={() => openLb(1)}>
			<img src={photos[1].src} alt={photos[1].alt} loading="lazy" />
		</div>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="gal-two-item" onclick={() => openLb(2)}>
			<img src={photos[2].src} alt={photos[2].alt} loading="lazy" />
		</div>
	</div>

	<!-- 풀폭 -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="gal-full fi d2" onclick={() => openLb(3)}>
		<img src={photos[3].src} alt={photos[3].alt} loading="lazy" />
	</div>

	<!-- 2단 -->
	<div class="gal-two fi d3" style="margin-top:3px">
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="gal-two-item" onclick={() => openLb(4)}>
			<img src={photos[4].src} alt={photos[4].alt} loading="lazy" />
		</div>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="gal-two-item" onclick={() => openLb(5)}>
			<img src={photos[5].src} alt={photos[5].alt} loading="lazy" />
		</div>
	</div>
</section>

<hr class="hr" />

<!-- ═══════════════════════════════════════════════════════════
     7. 방명록
═══════════════════════════════════════════════════════════ -->
<section class="sec" style="background:var(--sky-bg)">
	<span class="lbl fi">Guestbook</span>
	<hr class="hr-sm fi d1" />
	<p class="fi d1" style="text-align:center;font-size:.8rem;color:var(--sub);margin-bottom:1.8rem">축하의 마음을 남겨주세요 ♡</p>

	<div class="fi d2" style="display:flex;flex-direction:column;gap:.55rem;margin-bottom:2rem">
		<input class="inp" placeholder="이름" bind:value={gbName} maxlength={20} />
		<textarea class="inp" style="min-height:80px;resize:none" placeholder="축하 메시지를 남겨주세요" bind:value={gbText} maxlength={200}></textarea>
		<button class="btn-dark" onclick={addMsg} disabled={!gbName.trim() || !gbText.trim()}>
			메시지 남기기
		</button>
	</div>

	{#if msgs.length > 0}
		<div class="fi d3">
			{#each msgs as m}
				<div class="msg-card">
					<div class="msg-head">
						<span class="msg-name">{m.name}</span>
						<span class="msg-date">{m.date}</span>
					</div>
					<p class="msg-text">{m.text}</p>
				</div>
			{/each}
		</div>
	{/if}
</section>

<hr class="hr" />

<!-- ═══════════════════════════════════════════════════════════
     8. 마음 전하실 곳
═══════════════════════════════════════════════════════════ -->
<section class="sec">
	<span class="lbl fi">Account</span>
	<hr class="hr-sm fi d1" />
	<p class="fi d1" style="text-align:center;font-size:.8rem;color:var(--sub);margin-bottom:2rem">마음을 전하실 곳</p>

	<div class="fi d2">
		<div class="acc-panel" style="border-top:1px solid var(--line)">
			<button class="acc-head" onclick={() => (groomOpen = !groomOpen)}>
				신랑측 혼주 <span class="chevron" class:open={groomOpen}>▾</span>
			</button>
			{#if groomOpen}
				<div class="acc-body">
					{#each accounts.groom as a}
						<div class="acc-row">
							<div>
								<p style="font-size:.68rem;color:var(--muted);margin-bottom:2px">{a.label} · {a.bank}</p>
								<p class="acc-num">{a.num}</p>
							</div>
							<button class="btn-ghost" style="font-size:.66rem;padding:.32rem .7rem" onclick={() => copy(a.num, a.label)}>복사</button>
						</div>
					{/each}
				</div>
			{/if}
		</div>
		<div class="acc-panel">
			<button class="acc-head" onclick={() => (brideOpen = !brideOpen)}>
				신부측 혼주 <span class="chevron" class:open={brideOpen}>▾</span>
			</button>
			{#if brideOpen}
				<div class="acc-body">
					{#each accounts.bride as a}
						<div class="acc-row">
							<div>
								<p style="font-size:.68rem;color:var(--muted);margin-bottom:2px">{a.label} · {a.bank}</p>
								<p class="acc-num">{a.num}</p>
							</div>
							<button class="btn-ghost" style="font-size:.66rem;padding:.32rem .7rem" onclick={() => copy(a.num, a.label)}>복사</button>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</section>

<hr class="hr" />

<!-- ═══════════════════════════════════════════════════════════
     9. 공유
═══════════════════════════════════════════════════════════ -->
<section class="sec-sm" style="text-align:center;background:var(--sky-bg)">
	<span class="lbl fi">Share</span>
	<p class="fi d1" style="font-size:.78rem;color:var(--sub);margin:1.5rem 0">소중한 분들께 청첩장을 전해주세요</p>
	<div class="fi d2" style="display:flex;flex-direction:column;gap:.55rem;max-width:260px;margin:0 auto">
		<button class="btn-kakao">
			<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
				<path d="M12 3C6.477 3 2 6.477 2 10.667c0 2.623 1.447 4.947 3.666 6.399L4.5 21l4.383-2.321C9.893 18.88 10.934 19 12 19c5.523 0 10-3.477 10-8.333S17.523 3 12 3z"/>
			</svg>
			카카오톡 공유
		</button>
		<button class="btn-link2" onclick={shareLink}>
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
				<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
			</svg>
			링크 복사
		</button>
	</div>
</section>

<!-- Footer -->
<footer class="footer">
	<p class="footer-script">제영헌 &amp; 윤정서</p>
	<p class="footer-date">2026 · 12 · 12</p>
</footer>

<!-- Lightbox -->
{#if lbOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="lb-ov" onclick={() => (lbOpen = false)}>
		<button class="lb-close" onclick={() => (lbOpen = false)}>✕</button>
		<div onclick={(e) => e.stopPropagation()}>
			<img src={photos[lbIdx].src} alt={photos[lbIdx].alt} />
		</div>
		<button class="lb-arr lb-prev" onclick={(e) => { e.stopPropagation(); prev(); }}>‹</button>
		<button class="lb-arr lb-next" onclick={(e) => { e.stopPropagation(); next(); }}>›</button>
	</div>
{/if}

<div class="toast" class:show={toastOn}>{toastMsg}</div>

<style>
	/* ── Cover ──────────────────────────────────────────────── */
	.cover {
		min-height: 100svh;
		display: flex; flex-direction: column;
		align-items: center; justify-content: center;
		padding: 4rem 2rem 3rem;
		background: linear-gradient(165deg, #EBF3FC 0%, #F6F0EC 55%, #FBF8F5 100%);
		position: relative;
	}
	.cover-inner { width: 100%; max-width: 320px; text-align: center; }

	.cover-title-wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0;
		margin-bottom: 2rem;
	}
	.cover-script {
		font-family: 'Dancing Script', cursive;
		font-size: 3.4rem;
		font-weight: 700;
		color: var(--blue);
		line-height: 1.1;
		letter-spacing: .01em;
	}

	/* 인셋 사진 */
	.cover-inset {
		width: 160px;
		height: 200px;
		overflow: hidden;
		margin: .3rem auto;
		box-shadow: 0 4px 20px rgba(0,0,0,.1);
	}
	.cover-inset img { width: 100%; height: 100%; object-fit: cover; object-position: center top; }

	.cover-info { text-align: center; }
	.cover-names {
		display: flex; align-items: center; justify-content: center; gap: .8rem;
		margin-bottom: .4rem;
	}
	.cover-name-kr {
		font-family: 'Noto Serif KR', serif;
		font-size: 1.5rem; font-weight: 400; letter-spacing: .18em;
	}
	.cover-heart { color: var(--blue); font-size: .9rem; }
	.cover-name-en {
		font-family: 'Crimson Pro', serif; font-style: italic;
		font-size: .82rem; color: var(--sub); letter-spacing: .06em; margin-bottom: .9rem;
	}
	.cover-rule { border: none; border-top: 1px solid var(--line); margin: .9rem auto; width: 60px; }
	.cover-date-txt {
		font-family: 'Noto Serif KR', serif;
		font-size: .78rem; color: var(--sub); letter-spacing: .06em; margin-bottom: .3rem;
	}
	.cover-venue-txt {
		font-family: 'TmoneyRoundWind', sans-serif;
		font-size: .65rem; color: var(--muted); letter-spacing: .1em;
	}

	.cover-scroll { margin-top: 2.5rem; display: flex; flex-direction: column; align-items: center; gap: .4rem; }
	.scroll-dot {
		width: 5px; height: 5px; border-radius: 50%; background: var(--blue);
		animation: scrollBounce 1.8s infinite;
	}
	@keyframes scrollBounce {
		0%, 100% { transform: translateY(0); opacity: 1; }
		50%       { transform: translateY(6px); opacity: .4; }
	}

	/* ── Invitation ─────────────────────────────────────────── */
	.invite-title {
		font-family: 'Noto Serif KR', serif;
		font-size: .9rem; font-weight: 500; letter-spacing: .04em;
		margin-bottom: 1.8rem; color: var(--text);
	}
	.invite-body {
		font-family: 'Noto Serif KR', serif;
		font-size: .8rem; line-height: 2.15; color: var(--sub);
	}
	.invite-body + .invite-body { margin-top: 1.2rem; }

	/* ── Couple ─────────────────────────────────────────────── */
	.couple {
		display: flex; align-items: flex-start; justify-content: center;
		gap: .5rem; margin-top: 2.2rem;
	}
	.person { flex: 1; display: flex; flex-direction: column; align-items: center; gap: .3rem; }
	.p-img-wrap {
		width: 88px; height: 110px; overflow: hidden;
		margin-bottom: .5rem;
	}
	.p-img-wrap img { width: 100%; height: 100%; object-fit: cover; object-position: center top; }
	.p-role { font-family: 'Crimson Pro', serif; font-size: .6rem; letter-spacing: .22em; color: var(--blue); }
	.p-name { font-family: 'Noto Serif KR', serif; font-size: 1rem; font-weight: 500; letter-spacing: .12em; }
	.p-parents { font-size: .65rem; color: var(--muted); text-align: center; line-height: 1.6; }
	.p-call { margin-top: .5rem; }
	.couple-mid { display: flex; align-items: center; padding-top: 2.2rem; }
	.couple-heart { color: var(--blue); font-size: .9rem; }

	/* ── Date ───────────────────────────────────────────────── */
	.dt-main {
		font-family: 'Noto Serif KR', serif;
		font-size: 1.05rem; font-weight: 500; letter-spacing: .04em; margin: 1.8rem 0 .3rem;
	}
	.dt-sub { font-family: 'Crimson Pro', serif; font-size: .9rem; color: var(--sub); }
	.dday-box {
		display: inline-flex; align-items: baseline; gap: .1rem;
		padding: .5rem 1.3rem; border: 1px solid var(--line); margin: 1.4rem 0;
	}
	.dd-d { font-family: 'Crimson Pro', serif; font-size: .9rem; color: var(--blue); letter-spacing: .08em; }
	.dd-dash { font-family: 'Crimson Pro', serif; font-size: .9rem; color: var(--blue); }
	.dd-num { font-family: 'Crimson Pro', serif; font-size: 2rem; font-weight: 700; color: var(--text); line-height: 1; }
	.cal-month-lbl {
		font-family: 'Crimson Pro', serif; font-size: .85rem;
		letter-spacing: .15em; color: var(--sub); margin-bottom: 1rem;
	}

	/* ── Venue ──────────────────────────────────────────────── */
	.venue-name { font-family: 'Noto Serif KR', serif; font-size: 1.1rem; font-weight: 500; margin-bottom: .3rem; }
	.venue-hall { font-size: .76rem; color: var(--sub); margin-bottom: .25rem; }
	.venue-addr { font-size: .7rem; color: var(--muted); }
	.map-links { display: flex; gap: .5rem; justify-content: center; flex-wrap: wrap; margin-top: 1rem; }
	.map-links a { text-decoration: none; }

	/* ── Gallery / Our Story ────────────────────────────────── */
	.story-header {
		position: relative; width: 100%; aspect-ratio: 4/3; overflow: hidden;
		cursor: pointer;
	}
	.story-header img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s ease; }
	.story-header:hover img { transform: scale(1.03); }
	.story-header img { width: 100%; height: 100%; object-fit: cover; }
	.story-overlay {
		position: absolute; inset: 0;
		background: rgba(0,0,0,.28);
		display: flex; align-items: center; justify-content: center;
	}
	.story-script {
		font-family: 'Dancing Script', cursive;
		font-size: 3rem; font-weight: 700;
		color: #fff; letter-spacing: .02em;
		text-shadow: 0 2px 12px rgba(0,0,0,.3);
	}

	/* ── Footer ─────────────────────────────────────────────── */
	.footer {
		text-align: center; padding: 3rem 2rem;
		background: linear-gradient(135deg, #1C2E42 0%, #2A3D56 100%);
		border-top: none;
	}
	.footer-script {
		font-family: 'Dancing Script', cursive;
		font-size: 1.6rem; font-weight: 600; color: #88B8E0;
		margin-bottom: .3rem;
	}
	.footer-date {
		font-family: 'Crimson Pro', serif;
		font-size: .78rem; letter-spacing: .14em; color: rgba(255,255,255,.4);
	}
</style>
