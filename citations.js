/* ───────────────────────────────────────────────────────────────────
   citations.js — resolves <span class="cite" data-key="…"></span>
   into numbered author-year citations + an auto-built References
   section with back-references.

   Ported from dimblog/citations.js; catalog C below carries the 26
   references used on the Rex landing page.
   ─────────────────────────────────────────────────────────────────── */
(function(){
  const C = {
    // ─── foundations: diffusion / score-based ───
    'sohldickstein2015deep':   {authors:'Sohl-Dickstein, J., Weiss, E. A., Maheswaranathan, N., Ganguli, S.', title:'Deep unsupervised learning using nonequilibrium thermodynamics', venue:'ICML', year:2015, url:'https://arxiv.org/abs/1503.03585'},
    'ho2020ddpm':              {authors:'Ho, J., Jain, A., Abbeel, P.', title:'Denoising Diffusion Probabilistic Models', venue:'NeurIPS', year:2020, url:'https://arxiv.org/abs/2006.11239'},
    'song2021scorebased':      {authors:'Song, Y., Sohl-Dickstein, J., Kingma, D. P., Kumar, A., Ermon, S., Poole, B.', title:'Score-Based Generative Modeling through Stochastic Differential Equations', venue:'ICLR', year:2021, url:'https://arxiv.org/abs/2011.13456'},
    'song2021denoising':       {authors:'Song, J., Meng, C., Ermon, S.', title:'Denoising Diffusion Implicit Models', venue:'ICLR', year:2021, url:'https://arxiv.org/abs/2010.02502'},

    // ─── continuous flows / neural ODEs ───
    'anderson1982reverse':     {authors:'Anderson, B. D. O.', title:'Reverse-time diffusion equation models', venue:'Stochastic Processes and their Applications, 12(3):313&ndash;326', year:1982},
    'chen2018neuralode':       {authors:'Chen, R. T. Q., Rubanova, Y., Bettencourt, J., Duvenaud, D. K.', title:'Neural Ordinary Differential Equations', venue:'NeurIPS', year:2018, url:'https://arxiv.org/abs/1806.07366'},
    'li2020sdes':              {authors:'Li, X., Wong, T.-K. L., Chen, R. T. Q., Duvenaud, D.', title:'Scalable Gradients for Stochastic Differential Equations', venue:'AISTATS', year:2020, url:'https://arxiv.org/abs/2001.01328'},
    'kidger2021neural':        {authors:'Kidger, P., Foster, J., Li, X., Oberhauser, H., Lyons, T.', title:'Neural SDEs Made Easy: SDEs are Infinite-Dimensional GANs', venue:'arXiv:2102.03657', year:2021, url:'https://openreview.net/forum?id=padYzanQNbg'},

    // ─── reversible solvers (prior work) ───
    'kidger2021efficient':     {authors:'Kidger, P., Foster, J., Li, X. C., Lyons, T.', title:'Efficient and Accurate Gradients for Neural SDEs', venue:'NeurIPS', year:2021, url:'https://arxiv.org/abs/2105.13493'},
    'zhuang2021mali':          {authors:'Zhuang, J., Dvornek, N., Tatikonda, S., Duncan, J.', title:'MALI: A memory-efficient and reverse-accurate integrator for neural ODEs', venue:'ICLR', year:2021, url:'https://openreview.net/forum?id=blfSjHeFM_e'},
    'mccallum2024foster':      {authors:'McCallum, S., Foster, J.', title:'Efficient, Accurate and Stable Gradients for Neural ODEs', venue:'arXiv:2410.11648', year:2024, url:'https://arxiv.org/abs/2410.11648'},

    // ─── exact-inversion samplers for diffusion ───
    'wallace2023edict':        {authors:'Wallace, B., Gokul, A., Naik, N.', title:'EDICT: Exact Diffusion Inversion via Coupled Transformations', venue:'CVPR', year:2023, url:'https://arxiv.org/abs/2211.12446'},
    'zhang2024bdia':           {authors:'Zhang, G., Lewis, J. P., Kleijn, W. B.', title:'Exact Diffusion Inversion via Bidirectional Integration Approximation', venue:'ECCV', year:2024, doi:'10.1007/978-3-031-72998-0_2'},
    'wang2024belm':            {authors:'Wang, F., Yin, H., Dong, Y.-J., Zhu, H., Zhang, C., Zhao, H., Qian, H., Li, C.', title:'BELM: Bidirectional Explicit Linear Multi-step Sampler for Exact Inversion in Diffusion Models', venue:'NeurIPS', year:2024, url:'https://openreview.net/forum?id=ccQ4fmwLDb'},

    // ─── DPM-Solver family ───
    'lu2022dpmsolver':         {authors:'Lu, C., Zhou, Y., Bao, F., Chen, J., Li, C., Zhu, J.', title:'DPM-Solver: A Fast ODE Solver for Diffusion Probabilistic Model Sampling in Around 10 Steps', venue:'NeurIPS', year:2022, url:'https://arxiv.org/abs/2206.00927'},
    'lu2022dpmsolverpp':       {authors:'Lu, C., Zhou, Y., Bao, F., Chen, J., Li, C., Zhu, J.', title:'DPM-Solver++: Fast Solver for Guided Sampling of Diffusion Probabilistic Models', venue:'arXiv:2211.01095', year:2022, url:'https://arxiv.org/abs/2211.01095'},
    'gonzalez2024seeds':       {authors:'Gonzalez, M., Fernandez Pinto, N., Tran, T., Hajri, H., Masmoudi, N. et al.', title:'SEEDS: Exponential SDE Solvers for Fast High-Quality Sampling from Diffusion Models', venue:'NeurIPS', year:2024, url:'https://arxiv.org/abs/2305.14267'},
    'zhang2023gddim':          {authors:'Zhang, Q., Tao, M., Chen, Y.', title:'gDDIM: Generalized Denoising Diffusion Implicit Models', venue:'ICLR', year:2023, url:'https://openreview.net/forum?id=1hKE9qjvz-'},
    'foster2024shark':         {authors:'Foster, J. M., Dos Reis, G., Strange, C.', title:'High-order splitting methods for SDEs satisfying a commutativity condition', venue:'SIAM J. Numer. Anal., 62(1):500&ndash;532', year:2024},

    // ─── text-to-image + datasets ───
    'rombach2022ldm':          {authors:'Rombach, R., Blattmann, A., Lorenz, D., Esser, P., Ommer, B.', title:'High-Resolution Image Synthesis with Latent Diffusion Models', venue:'CVPR', year:2022, url:'https://arxiv.org/abs/2112.10752'},
    'karras2018progan':        {authors:'Karras, T., Aila, T., Laine, S., Lehtinen, J.', title:'Progressive Growing of GANs for Improved Quality, Stability, and Variation', venue:'ICLR', year:2018, url:'https://arxiv.org/abs/1710.10196'},

    // ─── evaluation metrics ───
    'stein2023exposing':       {authors:'Stein, G., Cresswell, J., Hosseinzadeh, R. et al.', title:'Exposing flaws of generative model evaluation metrics and their unfair treatment of diffusion models', venue:'NeurIPS', year:2023, url:'https://arxiv.org/abs/2306.04675'},
    'oquab2023dinov2':         {authors:'Oquab, M., Darcet, T., Moutakanni, T. et al.', title:'DINOv2: Learning Robust Visual Features without Supervision', venue:'arXiv:2304.07193', year:2023, url:'https://arxiv.org/abs/2304.07193'},
    'chong2020fidinf':         {authors:'Chong, M. J., Forsyth, D.', title:'Effectively Unbiased FID and Inception Score and Where to Find Them', venue:'CVPR', year:2020, url:'https://arxiv.org/abs/1911.07023'},
    'kynkaanniemi2019pr':      {authors:'Kynk&auml;&auml;nniemi, T., Karras, T., Laine, S., Lehtinen, J., Aila, T.', title:'Improved Precision and Recall Metric for Assessing Generative Models', venue:'NeurIPS', year:2019, url:'https://arxiv.org/abs/1904.06991'},
    'naeem2020density':        {authors:'Naeem, M. F., Oh, S. J., Uh, Y., Choi, Y., Yoo, J.', title:'Reliable Fidelity and Diversity Metrics for Generative Models', venue:'ICML', year:2020, url:'https://arxiv.org/abs/2002.09797'},

    // ─── downstream applications ───
    'rehman2026falcon':        {authors:'Rehman, D., Akhound-Sadegh, T., Gazizov, A., Bengio, Y., Tong, A.', title:'FALCON: Few-step accurate likelihoods for continuous flows', venue:'ICLR', year:2026, url:'https://openreview.net/forum?id=FbssShlI4N'},
    'blasingame2024adjointdeis':{authors:'Blasingame, Z. W., Liu, C.', title:'AdjointDEIS: Efficient Gradients for Diffusion Models', venue:'NeurIPS', year:2024, url:'https://arxiv.org/abs/2405.15020'},
  };

  /* ─── Sidenote (footnote) markup ─────────────────────────────── */
  let snCounter = 0;
  function makeNote(html){
    snCounter += 1;
    const id = 'sn-' + snCounter;
    const sup  = '<label class="margin-toggle-label" for="' + id + '"><sup class="sidenote-number"></sup></label>';
    const cb   = '<input type="checkbox" id="' + id + '" class="margin-toggle">';
    const note = '<span class="sidenote">' + html + '</span>';
    return sup + cb + note;
  }

  /* ─── Author-year formatting helpers ─────────────────────────── */
  function parseSurnames(s){
    if(!s) return [];
    const parts = s.split(',').map(t => t.trim()).filter(Boolean);
    const out = [];
    for(const p of parts){
      if(/^et\s+al\.?$/i.test(p)) { out.push('et al.'); continue; }
      if(/^([A-Z]\.?\s*\-?\s*)+$/.test(p)) continue;
      out.push(p);
    }
    return out;
  }
  function shortAuthors(s){
    const sur = parseSurnames(s);
    if(!sur.length) return '';
    if(sur.length === 1) return sur[0];
    if(sur[1] === 'et al.') return sur[0] + ' et al.';
    if(sur.length === 2)   return sur[0] + ' and ' + sur[1];
    return sur[0] + ' et al.';
  }

  /* ─── Bibliography entry formatting ──────────────────────────── */
  function fmtBibEntry(key){
    const c = C[key];
    if(!c) return '<em>[missing: ' + key + ']</em>';
    let s = '';
    if(c.authors) s += c.authors;
    if(c.year)    s += ' (' + c.year + ').';
    if(c.title){
      s += ' <em>' + c.title + '</em>';
      if(!/[.!?]$/.test(c.title)) s += '.';
    }
    if(c.venue) s += ' ' + c.venue + '.';
    if(c.url)       s += ' <a href="' + c.url + '">link</a>';
    else if(c.doi)  s += ' <a href="https://doi.org/' + c.doi + '">doi</a>';
    return s;
  }

  /* ─── Main pass ──────────────────────────────────────────────── */
  function process(){
    const cited = Object.create(null);
    let siteCounter = 0;

    document.querySelectorAll('.cite').forEach(el => {
      const keys = (el.getAttribute('data-key') || '').split(',').map(s => s.trim()).filter(Boolean);
      if(!keys.length){ el.remove(); return; }
      const style = (el.getAttribute('data-style') || 'parenthetical').toLowerCase();

      siteCounter += 1;
      const siteId = 'cite-' + siteCounter;

      const parts = keys.map(k => {
        const c = C[k];
        if(!c){
          return '<span class="cite-missing">[missing: ' + k + ']</span>';
        }
        (cited[k] = cited[k] || []).push({id: siteId, idx: siteCounter});
        const auth = shortAuthors(c.authors);
        const year = c.year || 'n.d.';
        const href = '#bib-' + cssEscape(k);
        if(style === 'year' && keys.length === 1){
          return '<a href="' + href + '" class="cite-link">(' + year + ')</a>';
        }
        if(style === 'narrative' && keys.length === 1){
          return '<a href="' + href + '" class="cite-link">' + auth + '</a>\u202F(' + year + ')';
        }
        return '<a href="' + href + '" class="cite-link">' + auth + ', ' + year + '</a>';
      });

      let inner;
      if((style === 'narrative' || style === 'year') && keys.length === 1){
        inner = parts[0];
      } else {
        inner = '(' + parts.join('; ') + ')';
      }
      const html = '<span class="cite-inline" id="' + siteId + '">' + inner + '</span>';

      const tmp = document.createElement('span');
      tmp.innerHTML = html;
      const node = tmp.firstChild;

      const prev = el.previousSibling;
      const needSpace = prev && prev.nodeType === Node.TEXT_NODE && !/\s$/.test(prev.nodeValue)
                      || prev && prev.nodeType === Node.ELEMENT_NODE;
      el.replaceWith(node);
      if(needSpace){
        node.parentNode.insertBefore(document.createTextNode(' '), node);
      }
    });

    document.querySelectorAll('.footnote').forEach(el => {
      const html = el.innerHTML;
      const wrap = document.createElement('span');
      wrap.innerHTML = makeNote(html);
      el.replaceWith(wrap);
    });

    document.querySelectorAll('.margin').forEach(el => {
      el.classList.remove('margin');
      el.classList.add('marginnote');
    });

    buildBibliography(cited);
  }

  function buildBibliography(cited){
    const keys = Object.keys(cited);
    if(!keys.length) return;

    keys.sort((a, b) => {
      const A = (parseSurnames((C[a]||{}).authors)[0] || a).toLowerCase();
      const B = (parseSurnames((C[b]||{}).authors)[0] || b).toLowerCase();
      if(A < B) return -1;
      if(A > B) return  1;
      const yA = (C[a]||{}).year || 0;
      const yB = (C[b]||{}).year || 0;
      return yA - yB;
    });

    // Target container — inside #references if it exists, else appended to body
    let host = document.getElementById('references-list-host');
    if(!host){
      const section = document.createElement('section');
      section.id = 'references';
      section.className = 'references';
      section.setAttribute('aria-label', 'References');
      const wrap = document.createElement('div');
      wrap.className = 'article-wrapper';
      const h2 = document.createElement('h2');
      h2.textContent = 'References';
      wrap.appendChild(h2);
      host = document.createElement('div');
      host.id = 'references-list-host';
      wrap.appendChild(host);
      section.appendChild(wrap);
      document.body.appendChild(section);
    }

    const ol = document.createElement('ol');
    ol.className = 'bib-list';

    keys.forEach(k => {
      const li = document.createElement('li');
      li.id = 'bib-' + cssEscape(k);
      li.className = 'bib-entry';

      const body = document.createElement('span');
      body.className = 'bib-body';
      body.innerHTML = fmtBibEntry(k);
      li.appendChild(body);

      const sites = cited[k];
      if(sites && sites.length){
        const back = document.createElement('span');
        back.className = 'bib-backrefs';
        back.appendChild(document.createTextNode(' ['));
        sites.forEach((s, i) => {
          if(i) back.appendChild(document.createTextNode(', '));
          const a = document.createElement('a');
          a.href = '#' + s.id;
          a.className = 'bib-backref';
          a.textContent = '§' + s.idx;
          back.appendChild(a);
        });
        back.appendChild(document.createTextNode(']'));
        li.appendChild(back);
      }

      ol.appendChild(li);
    });
    // Clear any prior content and append
    while(host.firstChild) host.removeChild(host.firstChild);
    host.appendChild(ol);
  }

  function cssEscape(s){
    if(window.CSS && CSS.escape) return CSS.escape(s);
    return String(s).replace(/[^a-zA-Z0-9_\-]/g, '_');
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', process);
  } else {
    process();
  }
})();
