import React, { useCallback, useEffect } from 'react';
import Presentation from '@neetos/pixie-pptx/presentation';

function Canvas() {
  const pptx = new Presentation();

  const onPptxDataReady = useCallback((err) => {
    if (err) {
      console.error(err);

      return;
    }

    const {
      width: slideWidth,
      height: slideHeight,
    } = pptx.getSlideSize();
    const slide = pptx.getSlide(1);
    const slidePics = slide.getPictures();
    const [pic] = slidePics;
    const picWidthRatio = pic.cx() / slideWidth;
    const picHeightRatio = pic.cy() / slideHeight;
    const picLeftRatio = pic.x() / slideWidth;
    const picTopRatio = pic.y() / slideHeight;

    console.log({
      picWidthRatio,
      picHeightRatio,
      picLeftRatio,
      picTopRatio,
    });

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target.result;
      // img.width = window.innerWidth * picWidthRatio;
      img.height = window.innerHeight * picHeightRatio;
      img.style.position = 'fixed';
      img.style.left = `${window.innerWidth * picLeftRatio}px`;
      img.style.top = `${window.innerHeight * picHeightRatio}px`;
      document.body.prepend(img);
    };

    if (pic) {
      reader.readAsDataURL(new Blob([pic.getDataUrl()]));
    }
  }, [pptx]);

  const onSelectedFileChanged = useCallback(({
    target: {
      files = [],
    },
  }) => {
    if (!window) {
      return;
    }

    const [file] = files;
    const fileReader = new FileReader();

    fileReader.onload = (e) => {
      pptx.load(e.target.result, onPptxDataReady);
    };

    fileReader.readAsArrayBuffer(file);
  }, [pptx]);

  if (0) {
    return (
      <div>
        <input type="file" onChange={onSelectedFileChanged} />
      </div>
    );
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('../../thirdparty/impress')
        .then(() => impress().init());
    }
  }, []);

  return (
    <div id="impress"
         data-transition-duration="1000"

         data-width="1920"
         data-height="1080"
         data-max-scale="3"
         data-min-scale="0"
         data-perspective="1000"

         data-autoplay="10">
      <div className="step slide title" data-x="-2200" data-y="-3000">
        <h1>Example Presentation: <br />
          Classic Slides</h1>
        <h2>Henrik Ingo</h2>
        <h3>2015</h3>

        <div className="notes">
          Any element with the className="notes" will not be displayed. This can
          be used for speaker notes. In fact, the impressConsole plugin will
          show it in the speaker console!
        </div>
      </div>

      <div id="toc" className="step slide" data-rel-x="2200" data-rel-y="0">
        <h1>Table of Contents</h1>
        <ul>
          <li><a href="#step-1">A title slide</a></li>
          <li><a href="#step-2">Table of Contents</a></li>
          <li><a href="#step-3">Text slide</a></li>
          <li><a href="#step-4">Bullet points</a></li>
          <li><a href="#step-5">Blockquote &amp; image</a></li>
          <li><a href="#step-6">More basic text styles</a></li>
          <li><a href="#step-7">Motion effects 101</a></li>
          <li><a href="#addons">Add-ons</a></li>
          <li><a href="#moreinfo">More info</a></li>
        </ul>

        <div className="notes">
          <p>Table of Contents, with links to other slides of this same presentation.</p>

          <p>Note that instead of absolute positioning we use relative positioning,
            with the data-rel-x and data-rel-y attributes. This means the step is
            positioned relative to the foregoing step. In other words, this is
            equivalent to data-x="0" data-y="-3000".</p>
        </div>
      </div>

      <div className="step slide">
        <h1>A slide with text</h1>
        <p>This slide has a few paragraphs <br />(p element) of normal text.</p>
        <p>Personally I like centered or even justified text, as it looks less boring. This can of course be set in <a
          href="css/classic-slides.css">the css file</a>.</p>
        <p>I really like the style on links in these presentations. I modified the border to be beveled, but it's mostly
          from <a href="http://impress.github.io/impress.js/">@bartaz' original demo</a>. <a
            href="https://twitter.com/bartaz">@bartaz</a> is the creator of impress.js.</p>

        <div className="notes">
          In this slide, we don't even specify the relative position, rather
          that too is inherited. So this slide will again be 1000px to the
          right of the previous one.
        </div>
      </div>

      <div className="step slide">
        <h1>Bullet points</h1>
        <ul>
          <li>A slide with bullet points. This is the first point.</li>
          <li>Second point</li>
          <li>Third point. Under this point we also have some sub-bullets:
            <ul>
              <li>Sub-bullet 1</li>
              <li>Sub-bullet 2</li>
            </ul>
          </li>
        </ul>

        <div className="notes">
        </div>
      </div>

      <div className="step slide" data-rel-x="2200" data-rel-y="600" data-rotate="30">
        <h1>A blockquote &amp; image</h1>
        <img src="images/3476636111_c551295ca4_b.jpg"
             alt="Mother Teresa holding a newborn baby"
             className="right" />
        <blockquote>
          Spread love everywhere you go. <br />Let no one ever come to you without leaving happier.
          <p style={{ textAlign: 'right' }}>Mother Teresa</p>
          <p className="left bottom"><small>Image credit: <a
            href="https://www.flickr.com/photos/peta-de-aztlan/3476636111/">Peta_de_Aztlan</a>@Flickr. CC-BY 2.0</small>
          </p>
        </blockquote>

        <div className="notes">
        </div>
      </div>

      <div className="step slide" data-rel-x="1600" data-rel-y="1600" data-rotate="60">
        <h1>More text styles</h1>
        <p>As usual, use <em>em</em> to emphasize, <br />
          <strong>strong</strong> for strong, <u>u</u> for underline,<br />
          <strike>strike</strike> for strikethrough and <q>q for inline quotations</q>.</p>

        <p>If you're a software engineer like me, you will often use the
          <code>&lt;code&gt;</code> tag for monospaced inline text.</p>

        <div className="notes">
        </div>
      </div>

      <div className="step slide" data-rel-x="600" data-rel-y="2200" data-rotate="90">
        <h1>Motion effects 101</h1>
        <p>Items on the slide can</p>
        <p className="fly-in fly-out">Fly in</p>
        <p className="fade-in fade-out" style={{ transitionDelay: '2s' }}>Fade in</p>
        <p className="zoom-in zoom-out" style={{ transitionDelay: '4s' }}>And zoom in</p>

        <p className="left bottom"><small>...just like in PowerPoint. Yeah, I know I'm being lame, but it was fun to
          learn to do this in CSS3.</small></p>

        <div className="notes">
          <p>This step here doesn't introduce anything new when it comes to data attributes, but you
            should notice in the demo that some words of this text are being animated.
            It's a very basic CSS transition that is applied to the elements when this step element is
            reached.
          </p><p>
          At the very beginning of the presentation all step elements are given the class of `future`.
          It means that they haven't been visited yet.
        </p><p>
          When the presentation moves to given step `future` is changed to `present` class name.
          That's how animation on this step works - text moves when the step has `present` class.
        </p><p>
          Finally when the step is left the `present` class is removed from the element and `past`
          class is added.
        </p><p>
          So basically every step element has one of three classes: `future`, `present` and `past`.
          Only one current step has the `present` class.
        </p>
        </div>
      </div>

      <div id="addons" className="step slide title" data-rel-x="-600" data-rel-y="2200" data-rotate="120">
        <h2>Add-ons</h2>
        <div className="notes">
          <p>This version of impress.js includes several add-ons, striving to make this a
            full featured presentation app.</p>
        </div>
      </div>

      <div className="step slide" data-rel-x="-1600" data-rel-y="1600" data-rotate="150" data-autoplay="3">
        <h1>Impress.js plugins</h1>
        <ul>
          <li>A new <a href="https://github.com/impress/impress.js/blob/master/src/plugins/README.md">plugin
            framework</a> allows for rich extensibility,
            without bloating the core rendering library.
            <ul>
              <li className="substep">Press 'P' to open a presenter console.</li>
              <li className="substep">When you move the mouse, navigation controls are visible on your bottom left</li>
              <li className="substep">Autoplay makes the slides advance after a timeout</li>
              <li className="substep">Relative positioning plugin is often a more convenient way to position your slides
                when editing. (<a
                  href="https://github.com/impress/impress.js/blob/master/examples/classic-slides/index.html">See html
                  for this presentation.</a>)
              </li>
            </ul>
          </li>
        </ul>
        <div className="notes">
          <p>This presentation also uses speaker notes. They are not visible in the presentation, but shown in the
            impress console.</p>

          <p>If you pressed P only now, this is the first time you see these notes. In fact, there has been notes on
            preceding slides as well.
            You can use the navigation controls at the bottom of the impress console to browse back to them.</p>

          <p>And did you notice how those bullet points appear one by one as you press space/arrow? That's another
            plugin, called substeps.</p>
        </div>
      </div>

      <div className="step slide" data-rel-x="-2200" data-rel-y="600" data-rotate="180">
        <h1>Highlight.js</h1>
        <div className="notes">
          <p>The Highlight.js library provides really nice color coding of source code.
            It automatically applies to any code inside a &lt;pre&gt;&lt;code&gt; element.</p>
          <p>Highlight.js is found under the <a
            href="https://github.com/impress/impress.js/tree/master/extras">extras/</a>
            directory, since it is an independent third party plugin, not really an impress.js plugin. You have
            to include it via it's own &lt;link&gt; and &lt;script&gt; tags.</p>
        </div>
      </div>

      <div className="step slide" data-rel-x="-2200" data-rel-y="-600" data-rotate="210">
        <h1>Mermaid.js</h1>
        <div className="mermaid">
          class A,D,E startEnd;
        </div>

        <h1><a href="http://docs.mathjax.org/en/latest/start.html">MathJax.js</a></h1>
        <div className="notes">
          directory, draws SVG diagrams from a MarkDown-like syntax. To learn
          more about it <a href="http://knsv.github.io/mermaid/index.html#usage">read the fine manual</a>.
        </div>
      </div>
    </div>
  );
}

export default Canvas;
