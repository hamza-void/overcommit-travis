<?php
/**
 * @file
 */
?>


<div class="age-gate-first-step " id="targetAgeGateWrapperId"
    <?php if ($background['type'] == 'image'): ?>  style="<?php print $background['content']; ?>" <?php endif; ?>>
    <?php if ($background['type'] == 'video'): ?>
        <video autoplay loop <?php print $background['content']['poster']; ?>  id="pernod-age-gate-bg-video" >
            <source src="<?php print $background['content']['url']; ?>" type="<?php print  $background['content']['type']; ?>">
            <?php print t('Video tag is not supported by your browser'); ?>
        </video>
    <?php endif; ?>
    <div class="age-gate-logo">
        <?php print render($logo); ?>
    </div>
    <div class="age-gate-lang">
        <?php print $lang; ?>
    </div>
    <div class="age-gate-container">

        <div class="age-gate-holder">
            <h2 id="pernod-age-gate-title"
                style="<?php if ($display_form != FALSE): ?> display :none; <?php endif; ?> "><?php print render($welcome_text); ?></h2>

            <div id="wrapper-age-gate" class="closed">

                <div id="wrapper-form-age-gate">
                    <h3><?php print render($intro_text); ?></h3>
                    <?php print render($links); ?>
                    <?php print $search; ?>
                </div>
            </div>
        </div>

    </div>
    <div id="abus-infos">
        <div id="abus-infos-block">
            <div class="ag-text-sanitaire">
                <?php print render($under_text); ?>
            </div>
            <div class="ag-legal-menu">
                <?php print $legal_menu; ?>
            </div>
        </div>
    </div>
</div>

